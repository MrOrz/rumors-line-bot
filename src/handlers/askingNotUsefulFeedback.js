import gql from '../gql';
import { getArticleURL, createPostbackAction } from './utils';

export default async function askingNotUsefulFeedback(params) {
  let { data, state, event, issuedAt, userId, replies, isSkipUser } = params;

  if (!data.selectedReplyId) {
    throw new Error('selectedReply not set in data');
  }

  if (event.input === 'n') {
    const {
      data: {
        action: { feedbackCount },
      },
    } = await gql`
      mutation($vote: FeedbackVote!, $articleId: String!, $replyId: String!) {
        action: CreateOrUpdateArticleReplyFeedback(
          articleId: $articleId
          replyId: $replyId
          vote: $vote
        ) {
          feedbackCount
        }
      }
    `(
      {
        articleId: data.selectedArticleId,
        replyId: data.selectedReplyId,
        vote: 'DOWNVOTE',
      },
      { userId }
    );

    replies = [
      {
        type: 'text',
        text:
          feedbackCount > 1
            ? `感謝您與其他 ${feedbackCount - 1} 人的回饋。`
            : '感謝您的回饋，您是第一個評論這個回應的人 :)',
      },
      {
        type: 'text',
        text: `💁 若您認為自己能回應得更好，歡迎到 ${getArticleURL(
          data.selectedArticleId
        )} 提交新的回應唷！`,
      },
    ];
    state = '__INIT__';
  } else {
    data.comment = event.input;

    replies = [
      {
        type: 'text',
        text: `以下是您所填寫的理由：「${event.input}」`,
      },
      {
        type: 'template',
        altText: '我們會把您覺得回應沒幫助的原因呈現給編輯們看。請確認：',
        template: {
          type: 'buttons',
          text: '我們會把您覺得回應沒幫助的原因呈現給編輯們看。請確認：',
          actions: [
            createPostbackAction('明白，我要送出', 'y', issuedAt),
            createPostbackAction('重寫送出的理由', 'r', issuedAt),
            createPostbackAction('算了，我不想填', 'n', issuedAt),
          ],
        },
      },
    ];

    state = 'ASKING_NOT_USEFUL_FEEDBACK_SUBMISSION';
  }
  return { data, state, event, issuedAt, userId, replies, isSkipUser };
}
