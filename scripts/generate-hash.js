import bcrypt from 'bcryptjs';

const password = 'rayanesigmaboy';

const hash = bcrypt.hashSync(password, 10);
console.log('Password hash:', hash);
