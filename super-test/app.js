var express = require('express');

// ��֮ǰһ��
var fibonacci = function (n) {
  // typeof NaN === 'number' �ǳ����ģ�����Ҫ�ж� NaN
  if (typeof n !== 'number' || isNaN(n)) {
    throw new Error('n should be a Number');
  }
  if (n < 0) {
    throw new Error('n should >= 0')
  }
  if (n > 10) {
    throw new Error('n should <= 10');
  }
  if (n === 0) {
    return 0;
  }
  if (n === 1) {
    return 1;
  }

  return fibonacci(n-1) + fibonacci(n-2);
};
// END ��֮ǰһ��

var app = express();

app.get('/fib', function (req, res) {
  // http �����Ķ���Ĭ�϶���û�����͵ģ����� String����������Ҫ�ֶ�ת������
  var n = Number(req.query.n);
  try {
    // Ϊ��ʹ�� String ������ת��������Ϊ�����ֱ�Ӹ������ָ� res.send �Ļ���
    // ���ᵱ�����������һ�� http ״̬�룬����������ȷ�� String
    res.send(String(fibonacci(n)));
  } catch (e) {
    // ��� fibonacci �״�Ļ���������Ϣ���¼�� err ����� .message �����С�
    // ��չ�Ķ���https://www.joyent.com/developers/node/design/errors
    res
      .status(500)
      .send(e.message);
  }
});

// ��¶ app ��ȥ��module.exports �� exports �������뿴������ǳ�� Node.js��
module.exports = app;

app.listen(3000, function () {
  console.log('app is listening at port 3000');
});