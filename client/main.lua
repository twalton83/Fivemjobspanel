local ESX = exports['es_extended']:getSharedObject()
local isOpen = false

local function togglePanel(open)
    isOpen = open
    SetNuiFocus(open, open)
    SendNUIMessage({
        action = 'setVisible',
        data = open
    })
end

RegisterCommand(Config.Command, function()
    if isOpen then
        togglePanel(false)
        return
    end

    ESX.TriggerServerCallback('jobspanel:getData', function(data)
        if not data then return end
        SendNUIMessage({
            action = 'loadData',
            data = data
        })
        togglePanel(true)
    end)
end, false)

RegisterNUICallback('close', function(_, cb)
    togglePanel(false)
    cb('ok')
end)

RegisterNUICallback('createJob', function(data, cb)
    ESX.TriggerServerCallback('jobspanel:createJob', function(result)
        cb(result)
    end, data)
end)

RegisterNUICallback('updateJob', function(data, cb)
    ESX.TriggerServerCallback('jobspanel:updateJob', function(result)
        cb(result)
    end, data)
end)

RegisterNUICallback('deleteJob', function(data, cb)
    ESX.TriggerServerCallback('jobspanel:deleteJob', function(result)
        cb(result)
    end, data)
end)

RegisterNUICallback('setPlayerJob', function(data, cb)
    ESX.TriggerServerCallback('jobspanel:setPlayerJob', function(result)
        cb(result)
    end, data)
end)

RegisterNUICallback('refreshData', function(_, cb)
    ESX.TriggerServerCallback('jobspanel:getData', function(data)
        cb(data)
    end)
end)
