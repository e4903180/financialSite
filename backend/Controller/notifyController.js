const con = require('../Model/connectFinancial')

exports.get_notify = async function(req, res){
    /*
        #swagger.tags = ['Notify']
        #swagger.description = 'Get user notify.'

        #swagger.parameters['readed'] = {
            in: 'query',
            description: 'Readed.',
            required: true,
            type: 'string',
            schema: "1"
        }

        #swagger.security = [{
            "apiAuth": []
        }]
    */
    let query = "SELECT * FROM notify WHERE username=?"
    let param = [req.session.userName]

    if (req.query.readed != "-1"){
        query += " AND read=?"
        param.push(req.query.readed)
    }

    try {
        const [rows, fields] = await con.promise().query(query, param);

        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    }
}

exports.notify_handle_read = async function(req, res){
    /*
        #swagger.tags = ['Notify']
        #swagger.description = 'Handle unread notify to readed.'

        #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Filter parameter.',
            required: true,
            type: 'object',
            schema: {
                $time: "2022-10-25 15:59",
            }
        }

        #swagger.security = [{
            "apiAuth": []
        }]
    */
    let query = "UPDATE notify SET `read`=? WHERE notifyTime=? AND username=?"
    let param = [1, req.body.time, req.session.userName]

    try {
        const [rows, fields] = await con.promise().query(query, param);

        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    }
}

exports.notify_handle_unread = async function(req, res){
    /*
        #swagger.tags = ['Notify']
        #swagger.description = 'Handle readed notify to unread.'

        #swagger.parameters['obj'] = {
            in: 'body',
            description: 'Filter parameter.',
            required: true,
            type: 'object',
            schema: {
                $time: "2022-10-25 15:59",
            }
        }

        #swagger.security = [{
            "apiAuth": []
        }]
    */
    let query = "UPDATE notify SET `read`=? WHERE notifyTime=? AND username=?"
    let param = [0, req.body.time, req.session.userName]

    try {
        const [rows, fields] = await con.promise().query(query, param);

        return res.status(200).send(rows)
    } catch (error) {
        return res.status(400).send("error")
    }
}


exports.get_unread_notify = async function(req, res){
    /*
        #swagger.tags = ['Notify']
        #swagger.description = 'Get user all unread notify.'

        #swagger.security = [{
            "apiAuth": []
        }]
    */
    let query = "SELECT COUNT(*) FROM notify WHERE username=? AND `read`=?"
    let param = [req.session.userName, 0]

    try {
        const [rows, fields] = await con.promise().query(query, param);
        return res.status(200).send(rows[0]['COUNT(*)'].toString())
    } catch (error) {
        return res.status(400).send("error")
    }
}