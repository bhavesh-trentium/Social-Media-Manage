import { createSlice } from "@reduxjs/toolkit";
import {
  FacebookVideosPost,
  fetchPostCategory,
  InstaPostVideo,
  pageList,
} from "../actions/actions";
import { ref, set } from "firebase/database";
import { database } from "../../firebase/Firebase";
export interface userItem {
  email: string;
  password: string;
}

export interface pageItem {
  access_token: string;
  token_type: string;
  PageName: string;
  PageID: string;
}

export interface PostState {
  user?: userItem;
  pageData?: pageItem[];
  selectPage?: pageItem;
  postCategory?: string[];
  loading: boolean;
  error: any;
}

const initialState: PostState = {
  user: undefined,
  pageData: undefined,
  selectPage: undefined,
  postCategory: undefined,
  loading: false,
  error: null,
};

const PostingSlice: any = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    pageSave: (state, action) => {
      state.selectPage = action.payload;
    },
    setPageDeatail: (state, action) => {
      set(ref(database, "facebook/pageDeatail"), {
        ...action.payload,
      });
    },
    setTwitterDeatail: (state, action) => {
      set(ref(database, "twitter/accountDeatail"), {
        ...action.payload,
      });
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(FacebookVideosPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(FacebookVideosPost.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
      })
      .addCase(FacebookVideosPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(InstaPostVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(InstaPostVideo.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
      })
      .addCase(InstaPostVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(pageList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(pageList.fulfilled, (state, action) => {
        localStorage.setItem("pageList", JSON.stringify(action.payload));
        state.error = null;
        state.loading = false;
      })
      .addCase(pageList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPostCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.postCategory = action.payload;
      })
      .addCase(fetchPostCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, pageSave, setPageDeatail, setTwitterDeatail } =
  PostingSlice.actions;
export default PostingSlice.reducer;
