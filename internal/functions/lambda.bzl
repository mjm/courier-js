load("@io_bazel_rules_go//go:def.bzl", "go_binary")
load("@rules_pkg//:pkg.bzl", "pkg_zip")

def lambda_function(
  name,
  svcname,
  importpath,
  deps = [],
):
  lambda_function_handler(
    name = name + "_main",
    svcname = svcname,
    importpath = importpath,
  )

  go_binary(
    name = name,
    srcs = [":" + name + "_main"],
    deps = [
      "@com_github_aws_aws_lambda_go//lambda:go_default_library",
      "//internal/functions:go_default_library",
    ] + deps,
    pure = "on",
    # static = "on",
  )

  pkg_zip(
    name = name + "_bundle",
    srcs = [":" + name],
  )

def _lambda_function_handler_impl(ctx):
  out = ctx.actions.declare_file(ctx.label.name + ".go")
  ctx.actions.expand_template(
      output = out,
      template = ctx.file._template,
      substitutions = {
        "{SERVICE_NAME}": ctx.attr.svcname,
        "{IMPORT_PATH}": ctx.attr.importpath,
      },
  )
  return [DefaultInfo(files = depset([out]))]

lambda_function_handler = rule(
  implementation = _lambda_function_handler_impl,
  attrs = {
    "svcname": attr.string(),
    "importpath": attr.string(),
    "_template": attr.label(
      allow_single_file = True,
      default = "//internal/functions:lambda_handler.go.tpl",
    ),
  },
)
