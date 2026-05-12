local ESX = exports['es_extended']:getSharedObject()

local function isAdmin(source)
    return IsPlayerAceAllowed(source, Config.AcePermission)
end

local function addLog(source, action, description)
    local xPlayer = ESX.GetPlayerFromId(source)
    local adminName = xPlayer and xPlayer.getName() or 'Unknown'
    MySQL.insert('INSERT INTO jobspanel_logs (admin_name, admin_identifier, action, description) VALUES (?, ?, ?, ?)', {
        adminName,
        xPlayer and xPlayer.getIdentifier() or 'unknown',
        action,
        description
    })
end

local function getFormattedJobs()
    local jobs = MySQL.query.await('SELECT * FROM jobs')
    local grades = MySQL.query.await('SELECT * FROM job_grades ORDER BY job_name, grade')

    local result = {}
    for _, job in ipairs(jobs) do
        local jobGrades = {}
        for _, grade in ipairs(grades) do
            if grade.job_name == job.name then
                table.insert(jobGrades, {
                    id = grade.job_name .. '_' .. grade.grade,
                    name = grade.label,
                    level = grade.grade,
                    salary = grade.salary
                })
            end
        end
        table.insert(result, {
            id = job.name,
            name = job.name,
            label = job.label,
            description = '',
            ranks = jobGrades,
            createdAt = '',
            updatedAt = ''
        })
    end
    return result
end

local function getFormattedPlayers()
    local players = MySQL.query.await('SELECT identifier, firstname, lastname, job, job_grade FROM users')
    local jobs = MySQL.query.await('SELECT name, label FROM jobs')

    local jobLabels = {}
    for _, job in ipairs(jobs) do
        jobLabels[job.name] = job.label
    end

    local result = {}
    for _, player in ipairs(players) do
        table.insert(result, {
            id = player.identifier,
            name = (player.firstname or '') .. ' ' .. (player.lastname or ''),
            identifier = player.identifier,
            jobId = player.job ~= 'unemployed' and player.job or nil,
            jobLabel = jobLabels[player.job] or 'Unemployed',
            rankLevel = player.job_grade
        })
    end
    return result
end

local function getFormattedLogs()
    local logs = MySQL.query.await('SELECT * FROM jobspanel_logs ORDER BY created_at DESC LIMIT 200')
    local result = {}
    for _, log in ipairs(logs or {}) do
        table.insert(result, {
            id = tostring(log.id),
            action = log.action,
            description = log.description,
            user = log.admin_name,
            timestamp = log.created_at
        })
    end
    return result
end

ESX.RegisterServerCallback('jobspanel:getData', function(source, cb)
    if not isAdmin(source) then cb(nil) return end
    cb({
        jobs = getFormattedJobs(),
        players = getFormattedPlayers(),
        logs = getFormattedLogs()
    })
end)

ESX.RegisterServerCallback('jobspanel:createJob', function(source, cb, data)
    if not isAdmin(source) then cb({ success = false }) return end

    local existing = MySQL.scalar.await('SELECT COUNT(*) FROM jobs WHERE name = ?', { data.name })
    if existing > 0 then
        cb({ success = false, error = 'Job already exists' })
        return
    end

    MySQL.insert.await('INSERT INTO jobs (name, label) VALUES (?, ?)', { data.name, data.label })

    for _, rank in ipairs(data.ranks or {}) do
        MySQL.insert.await('INSERT INTO job_grades (job_name, grade, name, label, salary) VALUES (?, ?, ?, ?, ?)', {
            data.name, rank.level, rank.name, rank.name, rank.salary
        })
    end

    ESX.RefreshJobs()
    addLog(source, 'CREATE_JOB', 'Created job: ' .. data.label)
    cb({ success = true, jobs = getFormattedJobs() })
end)

ESX.RegisterServerCallback('jobspanel:updateJob', function(source, cb, data)
    if not isAdmin(source) then cb({ success = false }) return end

    MySQL.update.await('UPDATE jobs SET label = ? WHERE name = ?', { data.label, data.name })
    MySQL.query.await('DELETE FROM job_grades WHERE job_name = ?', { data.name })

    for _, rank in ipairs(data.ranks or {}) do
        MySQL.insert.await('INSERT INTO job_grades (job_name, grade, name, label, salary) VALUES (?, ?, ?, ?, ?)', {
            data.name, rank.level, rank.name, rank.name, rank.salary
        })
    end

    ESX.RefreshJobs()
    addLog(source, 'UPDATE_JOB', 'Updated job: ' .. data.label)
    cb({ success = true, jobs = getFormattedJobs() })
end)

ESX.RegisterServerCallback('jobspanel:deleteJob', function(source, cb, data)
    if not isAdmin(source) then cb({ success = false }) return end

    local jobLabel = MySQL.scalar.await('SELECT label FROM jobs WHERE name = ?', { data.name })

    MySQL.update.await('UPDATE users SET job = ?, job_grade = ? WHERE job = ?', { 'unemployed', 0, data.name })
    MySQL.query.await('DELETE FROM job_grades WHERE job_name = ?', { data.name })
    MySQL.query.await('DELETE FROM jobs WHERE name = ?', { data.name })

    local xPlayers = ESX.GetExtendedPlayers('job', data.name)
    for _, xPlayer in pairs(xPlayers) do
        xPlayer.setJob('unemployed', 0)
    end

    ESX.RefreshJobs()
    addLog(source, 'DELETE_JOB', 'Deleted job: ' .. (jobLabel or data.name))
    cb({ success = true, jobs = getFormattedJobs() })
end)

ESX.RegisterServerCallback('jobspanel:setPlayerJob', function(source, cb, data)
    if not isAdmin(source) then cb({ success = false }) return end

    local jobName = data.jobName or 'unemployed'
    local grade = data.grade or 0

    MySQL.update.await('UPDATE users SET job = ?, job_grade = ? WHERE identifier = ?', {
        jobName, grade, data.identifier
    })

    local xTarget = ESX.GetPlayerFromIdentifier(data.identifier)
    if xTarget then
        xTarget.setJob(jobName, grade)
    end

    local jobLabel = MySQL.scalar.await('SELECT label FROM jobs WHERE name = ?', { jobName }) or 'Unemployed'
    addLog(source, 'UPDATE_USER_JOB', 'Set ' .. (data.playerName or 'player') .. ' to ' .. jobLabel .. ' (grade ' .. grade .. ')')
    cb({ success = true, players = getFormattedPlayers() })
end)

MySQL.ready(function()
    MySQL.query.await([[
        CREATE TABLE IF NOT EXISTS jobspanel_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            admin_name VARCHAR(50) NOT NULL,
            admin_identifier VARCHAR(60) NOT NULL,
            action VARCHAR(50) NOT NULL,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ]])
end)
