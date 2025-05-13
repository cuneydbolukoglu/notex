import { create } from 'zustand';

import allNoteStore from './store/useAllNoteStore';
import allTagsStore from './store/useTagsStore';
import archivedNote from './store/useArchivedNoteStore';

export const useAllNoteStore = create(allNoteStore);
export const useTagsStore = create(allTagsStore);
export const useArchivedNoteStore = create(archivedNote);