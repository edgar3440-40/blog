export type CommentType = {
  allCount: number
  comments: SingleCommentType[],
}

export type SingleCommentType = {
  id: string,
  text: string,
  date: string,
  likesCount: number,
  dislikesCount: number,
  liked?: boolean,
  disliked?: boolean,
  user: {
    id: string,
    name: string
  }
}

