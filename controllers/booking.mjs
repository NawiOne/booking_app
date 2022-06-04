import IncomeSchema from '../models/income.mjs';

const Income = {
    create: (req, res) => {
        const income = new IncomeSchema({
            id: 3,
            source_id: 'test3',
            amount: 'test1',
            created_at: undefined,
            created_by: 'test',
            updated_at: undefined,
            updated_by: 'test'
        })

        income.save().then((result) => {
            res.send({
                status: true,
                message: 'Success',
                data: {}
            });
        }).catch((err) => {
            res.status(500).send({
                status: false,
                message: 'Some error occurred while creating data',
                data: {}
            });
        });
    },
    findOne: (req, res) => {
        IncomeSchema.find({
            id: 3
        }).then(data => {
            res.json(data)
        }).catch(err => {
            res.status(500).send({
                message: err
            })
        })
    }

}

export default Income;