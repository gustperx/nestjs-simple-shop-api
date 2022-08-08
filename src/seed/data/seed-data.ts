import * as bcrypt from 'bcrypt';

interface SeedUser {
  email: string;
  fullName: string;
  password: string;
  roles: string[];
}

interface SeedData {
  users: SeedUser[];
}

export const initialData: SeedData = {
  users: [
    {
      email: 'test1@example.com',
      fullName: 'Test One',
      password: bcrypt.hashSync('Abc123', 10),
      roles: ['user', 'admin'],
    },
    {
      email: 'test2@example.com',
      fullName: 'Test Two',
      password: bcrypt.hashSync('Abc123', 10),
      roles: ['user'],
    },
  ],
};
