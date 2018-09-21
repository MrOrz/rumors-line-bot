import ga from '../ga';
import {
  createPostbackAction,
  createFlexMessageText,
  REASON_PLACEHOLDER,
  ellipsis,
} from './utils';

export default async function askingArticleSubmission(params) {
  let { data, state, event, issuedAt, userId, replies, isSkipUser } = params;

  const visitor = ga(userId, state, data.searchedText);

  if (event.input === REASON_PLACEHOLDER) {
    // if the user submits the prefilled 「因為......」 directly, ask him to resubmit
    replies = [{ type: 'text', text: '您的理由不夠充分，請重新填寫。' }];
  } else if (event.input === 'n') {
    // Track whether user create Article or not if the Article is not found in DB.
    visitor.event({
      ec: 'Article',
      ea: 'Create',
      el: 'No',
    });

    replies = [{ type: 'text', text: '訊息沒有送出，謝謝您的使用。' }];
    state = '__INIT__';
  } else {
    const reason = event.input;
    const altText =
      `以下是您所填寫的理由：\n「\n${ellipsis(reason, 200)}\n」\n` +
      '我們即將把此訊息與您填寫的理由送至資料庫。' +
      '若您送出的訊息或理由意味不明、造成闢謠編輯的困擾，可能會影響到您未來送出文章的權利。' +
      '\n' +
      '若要確認請輸入「y」、若要放棄請輸入「n」、若要重新填寫理由請輸入「r」';

    replies = [
      {
        type: 'flex',
        altText,
        contents: {
          type: 'bubble',
          styles: {
            footer: {
              separator: true,
            },
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: '把訊息送進資料庫',
                weight: 'bold',
                color: '#1DB446',
                size: 'sm',
              },
              {
                type: 'separator',
                margin: 'xxl',
              },
              {
                type: 'text',
                text: '訊息',
                weight: 'bold',
                size: 'xl',
                margin: 'xl',
              },
              {
                type: 'text',
                text: createFlexMessageText(data.searchedText),
                size: 'xs',
              },
              {
                type: 'separator',
                margin: 'xxl',
              },
              {
                type: 'text',
                text: '覺得是謠言的理由',
                weight: 'bold',
                size: 'xl',
                margin: 'xl',
              },
              {
                type: 'text',
                text: createFlexMessageText(reason),
                size: 'xxs',
              },
              {
                type: 'separator',
                margin: 'xxl',
              },
              {
                type: 'text',
                text:
                  '若您送出的訊息或理由意味不明、造成闢謠編輯的困擾，未來您將無法送出文章。',
                color: '#ff0000',
                wrap: true,
                margin: 'xxl',
              },
              {
                type: 'button',
                margin: 'xl',
                style: 'primary',
                action: createPostbackAction('放棄送出', 'n', issuedAt),
              },
              {
                type: 'button',
                action: createPostbackAction('重寫送出的理由', 'r', issuedAt),
              },
              {
                type: 'button',
                action: createPostbackAction('明白我要送出', 'y', issuedAt),
              },
            ],
          },
        },
      },
    ];
    data.reasonText = reason;
    state = 'ASKING_ARTICLE_SUBMISSION';
  }

  visitor.send();
  return { data, state, event, issuedAt, userId, replies, isSkipUser };
}