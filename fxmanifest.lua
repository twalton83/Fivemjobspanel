fx_version 'cerulean'
game 'gta5'

name 'Fivemjobspanel'
author 'InDaLou'
version '1.0.0'
description 'Admin panel for managing jobs, ranks, and player assignments'

ui_page 'html/index.html'

files {
    'html/**',
    'config.lua',
}

shared_scripts {
    'config.lua',
}

client_scripts {
    'client/main.lua',
}

server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'server/main.lua',
}

lua54 'yes'
