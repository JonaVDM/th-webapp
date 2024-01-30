import Pocketbase, { type RecordModel, RecordService } from 'pocketbase';

export interface Note extends RecordModel {
  text: string;
  user: string;
}

export interface TypedPocketBase extends Pocketbase {
  collection(idOrName: string): RecordService
  collection(idOrName: 'notes'): RecordService<Note>
}
