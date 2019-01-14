import { UserFioPipe } from './user-fio.pipe';

describe('UserFioPipe', () => {
  it('create an instance', () => {
    const pipe = new UserFioPipe();
    expect(pipe).toBeTruthy();
  });
});
