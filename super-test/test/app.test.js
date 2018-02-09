var app = require('../app');
var supertest = require('supertest');
// ��������䣬���ǹؼ�һ�䡣�õ��� request �������ֱ�Ӱ���
// superagent �� API ���е���
var request = supertest(app);

var should = require('should');

describe('test/app.test.js', function () {
  // ���ǵĵ�һ�������������ú����һ��
  it('should return 55 when n is 10', function (done) {
    // ֮����������Ե� function Ҫ����һ�� done ����������Ϊ���ǵĲ�������
    // �漰���첽���ã��� mocha ���޷���֪�첽������ɵġ��������������������ṩ
    // �� done �������ڲ������ʱ�����е���һ�£���ʾ������
    // mocha ���Ը�֪�����ǵĲ��Ժ����Ƿ���� done ������js �У�function
    // �������г��ȵģ����ĳ��������Ĳ�����������
    // (function (a, b, c, d) {}).length === 4
    // ���� mocha ͨ�����ǲ��Ժ����ĳ��ȾͿ���ȷ�������Ƿ����첽���ԡ�

    request.get('/fib')
    // .query ���������� querystring��.send ���������� body��
    // ���Ƕ����Դ� Object �����ȥ��
    // ��������ǵ��ڷ��ʵ��� /fib?n=10
      .query({n: 10})
      .end(function (err, res) {
        // ���� http ���ص��� String��������Ҫ���� '55'��
        res.text.should.equal('55');

        // done(err) �����÷�д�����ܼ��ߣ�����Ϊ͵������� err ��ֵ
        // ����ڿ�㣬����Ӧ��д��
        /*
        should.not.exist(err);
        res.text.should.equal('55');
        */
        done(err);
      });
  });

  // �������Ƕ��ڸ��ֱ߽����������в��ԣ��������ǵĴ�����ͬ��
  // �����ҳ��������һ�� testFib ������
  var testFib = function (n, statusCode, expect, done) {
    request.get('/fib')
      .query({n: n})
      .expect(statusCode)
      .end(function (err, res) {
        res.text.should.equal(expect);
        done(err);
      });
  };
  it('should return 0 when n === 0', function (done) {
    testFib(0, 200, '0', done);
  });

  it('should equal 1 when n === 1', function (done) {
    testFib(1, 200, '1', done);
  });

  it('should equal 55 when n === 10', function (done) {
    testFib(10, 200, '55', done);
  });

  it('should throw when n > 10', function (done) {
    testFib(11, 500, 'n should <= 10', done);
  });

  it('should throw when n < 0', function (done) {
    testFib(-1, 500, 'n should >= 0', done);
  });

  it('should throw when n isnt Number', function (done) {
    testFib('good', 500, 'n should be a Number', done);
  });

  // ��������һ�·����� 500
  it('should status 500 when error', function (done) {
    request.get('/fib')
      .query({n: 100})
      .expect(500)
      .end(function (err, res) {
        done(err);
      });
  });
});