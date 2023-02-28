import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getLeadsContent = createAsyncThunk('/leads/content', async () => {
  const response = await axios.get('/api/users?page=2', {});
  return response.data;
});

export const leadsSlice = createSlice({
  name: 'leads',
  initialState: {
    isLoading: false,
    leads: [] as any[],
  },
  reducers: {
    addNewLead: (state, action) => {
      const { newLeadObj } = action.payload;
      state.leads = [...state.leads, newLeadObj] as any[];
    },

    deleteLead: (state, action) => {
      const { index } = action.payload;
      state.leads.splice(index, 1);
    },
  },

  extraReducers: (builder) => {
    const { pending, fulfilled, rejected } = getLeadsContent;

    builder
      .addCase(pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fulfilled, (state, action) => {
        state.leads = action.payload.data;
        state.isLoading = false;
      })
      .addCase(rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { addNewLead, deleteLead } = leadsSlice.actions;

export default leadsSlice.reducer;
