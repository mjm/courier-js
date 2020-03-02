// Code generated by protoc-gen-go. DO NOT EDIT.
// source: tasks.proto

package feeds

import (
	fmt "fmt"
	proto "github.com/golang/protobuf/proto"
	math "math"
)

// Reference imports to suppress errors if they are not otherwise used.
var _ = proto.Marshal
var _ = fmt.Errorf
var _ = math.Inf

// This is a compile-time assertion to ensure that this generated file
// is compatible with the proto package it is being compiled against.
// A compilation error at this line likely means your copy of the
// proto package needs to be updated.
const _ = proto.ProtoPackageIsVersion3 // please upgrade the proto package

type RefreshFeedTask struct {
	UserId               string   `protobuf:"bytes,1,opt,name=user_id,json=userId,proto3" json:"user_id,omitempty"`
	FeedId               string   `protobuf:"bytes,2,opt,name=feed_id,json=feedId,proto3" json:"feed_id,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *RefreshFeedTask) Reset()         { *m = RefreshFeedTask{} }
func (m *RefreshFeedTask) String() string { return proto.CompactTextString(m) }
func (*RefreshFeedTask) ProtoMessage()    {}
func (*RefreshFeedTask) Descriptor() ([]byte, []int) {
	return fileDescriptor_b3834c8ef8464a3f, []int{0}
}

func (m *RefreshFeedTask) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_RefreshFeedTask.Unmarshal(m, b)
}
func (m *RefreshFeedTask) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_RefreshFeedTask.Marshal(b, m, deterministic)
}
func (m *RefreshFeedTask) XXX_Merge(src proto.Message) {
	xxx_messageInfo_RefreshFeedTask.Merge(m, src)
}
func (m *RefreshFeedTask) XXX_Size() int {
	return xxx_messageInfo_RefreshFeedTask.Size(m)
}
func (m *RefreshFeedTask) XXX_DiscardUnknown() {
	xxx_messageInfo_RefreshFeedTask.DiscardUnknown(m)
}

var xxx_messageInfo_RefreshFeedTask proto.InternalMessageInfo

func (m *RefreshFeedTask) GetUserId() string {
	if m != nil {
		return m.UserId
	}
	return ""
}

func (m *RefreshFeedTask) GetFeedId() string {
	if m != nil {
		return m.FeedId
	}
	return ""
}

func init() {
	proto.RegisterType((*RefreshFeedTask)(nil), "courier.feeds.RefreshFeedTask")
}

func init() { proto.RegisterFile("tasks.proto", fileDescriptor_b3834c8ef8464a3f) }

var fileDescriptor_b3834c8ef8464a3f = []byte{
	// 117 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0xe2, 0xe2, 0x2e, 0x49, 0x2c, 0xce,
	0x2e, 0xd6, 0x2b, 0x28, 0xca, 0x2f, 0xc9, 0x17, 0xe2, 0x4d, 0xce, 0x2f, 0x2d, 0xca, 0x4c, 0x2d,
	0xd2, 0x4b, 0x4b, 0x4d, 0x4d, 0x29, 0x56, 0x72, 0xe6, 0xe2, 0x0f, 0x4a, 0x4d, 0x2b, 0x4a, 0x2d,
	0xce, 0x70, 0x4b, 0x4d, 0x4d, 0x09, 0x49, 0x2c, 0xce, 0x16, 0x12, 0xe7, 0x62, 0x2f, 0x2d, 0x4e,
	0x2d, 0x8a, 0xcf, 0x4c, 0x91, 0x60, 0x54, 0x60, 0xd4, 0xe0, 0x0c, 0x62, 0x03, 0x71, 0x3d, 0x53,
	0x40, 0x12, 0x20, 0x4d, 0x20, 0x09, 0x26, 0x88, 0x04, 0x88, 0xeb, 0x99, 0xe2, 0xc4, 0x1e, 0xc5,
	0x0a, 0x36, 0x2d, 0x89, 0x0d, 0x6c, 0x87, 0x31, 0x20, 0x00, 0x00, 0xff, 0xff, 0x2a, 0x1b, 0xcf,
	0x64, 0x72, 0x00, 0x00, 0x00,
}
