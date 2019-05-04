import {
  createPostbackAction,
  createFeedbackWords,
  isNonsenseText,
  createReferenceWords,
  ellipsis,
  createArticleShareReply,
} from '../utils';

describe('createArticleShareReply()', () => {
  it('should uri size less then 1000', () => {
    const articleUrl =
      'https://cofacts.hacktabl.org/article/AWDZYXxAyCdS-nWhumlz';
    const reason = `我於是向他說:「你也知道那江水和月亮嗎？江水雖然不停的流，但是它的本體並不曾流去啊;月亮雖然有圓有缺，可是月的本身並沒有增減啊。若從變的角度來看，那麼天地間的一切萬物竟不能有一刻的時間永恆不變;從不變的角度來看，則萬物和我的生命都是同樣永遠存在。這樣說來，我們又何必去羨慕那自然界永存之物呢？而且大地之間，萬物各有它的所有者，如果不屬於我所有，雖然一絲一毫也不貪取;只有江上的清風和山間的明月;耳聽到了就成為樂聲，眼睛看到了就成為美景，取用它沒有人去禁止，享用它卻用不盡，這是創造萬物的自然賜給我們人類的無盡寶藏啊，也是我和你所可以共同隨意享受的。」`;

    const result = createArticleShareReply(articleUrl, reason);
    result.template.actions.forEach(action => {
      expect(action.uri.length).toBeLessThan(1000);
      expect(action.uri).toMatchSnapshot();
    });
  });
});

describe('ellipsis()', () => {
  it('should not ellipsis when text is short', () => {
    expect(ellipsis('12345', 10)).toBe('12345');
  });

  it('should ellipsis when text is too long', () => {
    const limit = 5;
    const processed = ellipsis('1234567890', limit);
    expect(processed).toHaveLength(limit);
    expect(processed).toMatchSnapshot();
  });

  it('should properly cut emojis', () => {
    expect(ellipsis('🏳️‍🌈🏳️‍🌈🏳️‍🌈🏳️‍🌈🏳️‍🌈🏳️‍🌈🏳️‍🌈🏳️‍🌈🏳️‍🌈🏳️‍🌈', 5)).toMatchSnapshot();
  });

  it('should be able to customize ellipsis', () => {
    expect(ellipsis('1234567890', 5, '')).toBe('12345');
  });
});

describe('createPostbackAction()', () => {
  it('should return postback message body', () => {
    expect(
      createPostbackAction('閱讀此回應', 3, 1519019701265)
    ).toMatchSnapshot();
  });
});

describe('createFeedbackWords()', () => {
  it('should create empty feedback words', () => {
    expect(createFeedbackWords(0, 0)).toMatchSnapshot();
  });
  it('should create positive feedback words', () => {
    expect(createFeedbackWords(3, 0)).toMatchSnapshot();
  });
  it('should create negative feedback words', () => {
    expect(createFeedbackWords(0, 2)).toMatchSnapshot();
  });
  it('should create both feedback words', () => {
    expect(createFeedbackWords(1, 2)).toMatchSnapshot();
  });
});

describe('createReferenceWords()', () => {
  it('should create reference for rumors', () => {
    expect(
      createReferenceWords({
        reference: 'This is a reference',
        type: 'RUMOR',
      })
    ).toMatchSnapshot();
  });
  it('should create reference for opinions', () => {
    expect(
      createReferenceWords({
        reference: 'This is refering to different opinions',
        type: 'OPINIONATED',
      })
    ).toMatchSnapshot();
  });
});

// According to 20181017 meeting note, we chose to remove limitation temporarily.
xdescribe('isNonsenseText()', () => {
  it('should detect a info-less text [1]', () => {
    // https://cofacts.g0v.tw/article/AV84hj72yCdS-nWhuhxh
    let text = '這個人是不是在做援交的 請分析';
    expect(isNonsenseText(text)).toBe(true);
  });

  it('should detect a info-less text [2]', () => {
    // https://cofacts.g0v.tw/article/AV9MDX05yCdS-nWhuh73
    let text = '米飯 放涼 抗癌';
    expect(isNonsenseText(text)).toBe(true);
  });

  it('should detect a info-less text [3]', () => {
    // https://cofacts.g0v.tw/reply/njr6amQBbZnN2I-EfJfV
    let text = '嗨，請問蔡英文是同性戀，是真的嗎？';
    expect(isNonsenseText(text)).toBe(true);
  });

  it('should detect a normal text [1]', () => {
    let text = `如果你真的直接就去改資費方案的話，恐怕根本沒省到，
      甚至電話費還反而變貴了！https://today.line.me/TW/article/0BwyWj?utm_source=lineshare`;
    expect(isNonsenseText(text)).toBe(false);
  });

  it('should allow a normal text [2]', () => {
    let text = `http://goo.gl/3pZNro`;
    expect(isNonsenseText(text)).toBe(false);
  });

  /**
   *  Can't parse url without ^http.
   */
  xit('should detect a text with a single url', () => {
    let text = '不要點開 google.com';
    let newText = isNonsenseText(text);
    console.log({ text, newText });
  });
});
