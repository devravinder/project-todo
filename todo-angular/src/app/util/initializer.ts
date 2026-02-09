import { initDB } from './db';

export const onAppStart = async () => {
  console.log('App initializing...');

  await initDB();
  console.log('App initializitaion don');
};

export default onAppStart;
