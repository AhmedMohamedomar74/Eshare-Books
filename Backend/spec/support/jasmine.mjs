export default {
  spec_dir: "src/modules",
  spec_files: [
    "**/*[sS]pec.?(m)js"
  ],
  helpers: [
    "../spec/support/helpers/**/*.?(m)js"
  ],
  env: {
    stopSpecOnExpectationFailure: false,
    random: false,
    forbidDuplicateNames: true
  }
}
