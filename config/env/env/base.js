module.exports = {
  port: '3000',
  domain: 'localhost',
  host: 'localhost:3000',
  staticSuffix: '',
  exportTarget: 'inner',
  service: {
    main: '//localhost:3000/api/v1',
    oss: {
      bucket: '',
      region: ''
    }
  }
}
