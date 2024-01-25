import bcrypt from 'bcrypt'
const saltRounds = String(process.env.SALT_ROUNDS);

const encryptPassword = (str: string) => {
    return bcrypt.hashSync(str, saltRounds)
}

const comparePassword = (password: string, encodedPassword: string) => {
    return bcrypt.compareSync(password, encodedPassword);
}

export { encryptPassword, comparePassword };