const createProxyMiddleware = require('http-proxy-middleware')
const { rootApiIP } = require('./constant')

module.exports = function(app) {
    app.use("/api", createProxyMiddleware({
        target : rootApiIP
    }))
}
// module.exports = function(app) {
//     app.use(proxy("/user/login"), {
//         target : rootApiIP
//     })
// }

// module.exports = function(app) {
//     app.use(proxy("/user/logout"), {
//         target : rootApiIP
//     })
// }