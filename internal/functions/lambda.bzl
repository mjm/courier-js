load("@io_bazel_rules_go//go:def.bzl", "go_binary")
load("@rules_pkg//:pkg.bzl", "pkg_zip")

def _runfile_path(ctx, f):
  if ctx.workspace_name:
    path = ctx.workspace_name + "/" + f.short_path
  else:
    path = f.short_path

  return "${RUNFILES}/" + path

def lambda_function(
  name,
  svcname,
  importpath,
  handler = None,
  deps = [],
  data = [],
):
  lambda_function_handler(
    name = name + "_main",
    svcname = svcname,
    importpath = importpath,
    handler = handler,
  )

  go_binary(
    name = name,
    srcs = [":" + name + "_main"],
    deps = [
      "@com_github_aws_aws_lambda_go//lambda:go_default_library",
      "//internal/functions:go_default_library",
      "//internal/trace:go_default_library",
    ] + deps,
    pure = "on",
    x_defs = {
      "github.com/mjm/courier-js/internal/trace.ServiceVersion": "{GIT_COMMIT_SHA}",
    },
  )

  handler = ":" + name

  native.genrule(
    name = name + "_bundle",
    srcs = [handler] + data,
    outs = [name + ".zip"],
    cmd = "zip -jq $@ $(SRCS)",
    visibility = ["//:__subpackages__"],
  )

def _lambda_function_handler_impl(ctx):
  template = ctx.file._template
  subs = {
    "{SERVICE_NAME}": ctx.attr.svcname,
    "{IMPORT_PATH}": ctx.attr.importpath,
  }

  if ctx.attr.handler != "":
    template = ctx.file._custom_template
    subs["{HANDLER_FUNC}"] = ctx.attr.handler

  out = ctx.actions.declare_file(ctx.label.name + ".go")
  ctx.actions.expand_template(
      output = out,
      template = template,
      substitutions = subs,
  )
  return [DefaultInfo(files = depset([out]))]

lambda_function_handler = rule(
  implementation = _lambda_function_handler_impl,
  attrs = {
    "svcname": attr.string(),
    "importpath": attr.string(),
    "handler": attr.string(),
    "_template": attr.label(
      allow_single_file = True,
      default = "//internal/functions:lambda_handler.go.tpl",
    ),
    "_custom_template": attr.label(
      allow_single_file = True,
      default = "//internal/functions:lambda_custom_handler.go.tpl",
    ),
  },
)

def _lambda_functions_upload_impl(ctx):
  runfiles = ctx.runfiles(
    files = [
      ctx.executable._uploader,
      ctx.info_file,
      ctx.version_file,
    ] + ctx.files.bundles,
  )

  ctx.actions.expand_template(
    template = ctx.file._upload_tpl,
    substitutions = {
      "{UPLOADER}": _runfile_path(ctx, ctx.executable._uploader),
      "{INFO_FILE}": _runfile_path(ctx, ctx.info_file),
      "{VERSION_FILE}": _runfile_path(ctx, ctx.version_file),
      "{BUCKET}": ctx.attr.bucket,
      "{MANIFEST_KEY}": ctx.attr.manifest_key,
      "{UPLOADER_ARGS}": " ".join([
        _runfile_path(ctx, f) for f in ctx.files.bundles
      ]),
    },
    output = ctx.outputs.executable,
    is_executable = True,
  )

  return [
    DefaultInfo(
      executable = ctx.outputs.executable,
      runfiles = runfiles,
    ),
  ]

lambda_functions_upload = rule(
  implementation = _lambda_functions_upload_impl,
  attrs = {
    "bundles": attr.label_list(),
    "bucket": attr.string(),
    "manifest_key": attr.string(),
    "_uploader": attr.label(
      default = "//cmd/upload-functions",
      cfg = "host",
      executable = True,
    ),
    "_upload_tpl": attr.label(
      default = "//internal/functions:lambda_upload.sh.tpl",
      allow_single_file = True,
    ),
  },
  executable = True,
)
