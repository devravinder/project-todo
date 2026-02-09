import dayjs from 'dayjs';

export const getId=(size: number=8)=>crypto.randomUUID().slice(0, size)

export const sortDsc = (f: Task, s: Task) => dayjs(s.lastModifiedDate).valueOf() - dayjs(f.lastModifiedDate).valueOf()
  //(s.lastModifiedDate?.getTime() || 0) - (f.lastModifiedDate?.getTime() || 0);
