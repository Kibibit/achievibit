const nconf = {
  argv(...options) {
    return this;
  },
  env(...options) {
    return this;
  },
  file(...options) {
    return this;
  },
  get(key?: string): any {
    return key ? 'from_nconf' : {};
  }
};

export default nconf;
