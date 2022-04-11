module.exports = {
    configureWebpack: {
        resolve: {
            alias: {
                // 别名
                'assets': '@/assets',
                'components': '@/components',
                'network': '@/network',
                'utils': '@/utils',
                'views': '@/views',
            }
        }
    }
}