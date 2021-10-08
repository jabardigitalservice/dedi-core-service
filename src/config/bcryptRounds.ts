import config from '.'

export default Number(config.get('bcrypt.rounds', 10))
