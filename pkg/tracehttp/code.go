package tracehttp

import (
	"net/http"

	"google.golang.org/grpc/codes"
)

func Code(status int) codes.Code {
	if status >= 100 && status < 400 {
		return codes.OK
	}

	if status == http.StatusUnauthorized {
		return codes.Unauthenticated
	}

	if status == http.StatusForbidden {
		return codes.PermissionDenied
	}

	if status == http.StatusNotFound {
		return codes.NotFound
	}

	if status == http.StatusConflict {
		return codes.AlreadyExists
	}

	if status == http.StatusPreconditionFailed {
		return codes.FailedPrecondition
	}

	if status == http.StatusRequestedRangeNotSatisfiable {
		return codes.OutOfRange
	}

	if status == http.StatusTooManyRequests {
		return codes.ResourceExhausted
	}

	if status >= 400 && status < 500 {
		return codes.InvalidArgument
	}

	if status == http.StatusNotImplemented {
		return codes.Unimplemented
	}

	if status == http.StatusServiceUnavailable {
		return codes.Unavailable
	}

	if status == http.StatusGatewayTimeout {
		return codes.DeadlineExceeded
	}

	if status >= 500 {
		return codes.Internal
	}

	return codes.Unknown
}

func StatusCode(code codes.Code) int {
	switch code {
	case codes.OK:
		return http.StatusOK
	case codes.Canceled, codes.Unknown, codes.Internal, codes.DataLoss:
		return http.StatusInternalServerError
	case codes.InvalidArgument:
		return http.StatusBadRequest
	case codes.DeadlineExceeded:
		return http.StatusGatewayTimeout
	case codes.NotFound:
		return http.StatusNotFound
	case codes.AlreadyExists, codes.Aborted:
		return http.StatusConflict
	case codes.PermissionDenied:
		return http.StatusForbidden
	case codes.ResourceExhausted:
		return http.StatusTooManyRequests
	case codes.FailedPrecondition:
		return http.StatusPreconditionFailed
	case codes.OutOfRange:
		return http.StatusRequestedRangeNotSatisfiable
	case codes.Unimplemented:
		return http.StatusNotImplemented
	case codes.Unavailable:
		return http.StatusServiceUnavailable
	case codes.Unauthenticated:
		return http.StatusUnauthorized
	}

	return http.StatusInternalServerError
}
