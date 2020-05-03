// Code generated by protoc-gen-go. DO NOT EDIT.
// source: events.proto

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

type FeedCreated struct {
	UserId               string   `protobuf:"bytes,1,opt,name=user_id,json=userId,proto3" json:"user_id,omitempty"`
	FeedId               string   `protobuf:"bytes,2,opt,name=feed_id,json=feedId,proto3" json:"feed_id,omitempty"`
	Url                  string   `protobuf:"bytes,3,opt,name=url,proto3" json:"url,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *FeedCreated) Reset()         { *m = FeedCreated{} }
func (m *FeedCreated) String() string { return proto.CompactTextString(m) }
func (*FeedCreated) ProtoMessage()    {}
func (*FeedCreated) Descriptor() ([]byte, []int) {
	return fileDescriptor_8f22242cb04491f9, []int{0}
}

func (m *FeedCreated) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_FeedCreated.Unmarshal(m, b)
}
func (m *FeedCreated) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_FeedCreated.Marshal(b, m, deterministic)
}
func (m *FeedCreated) XXX_Merge(src proto.Message) {
	xxx_messageInfo_FeedCreated.Merge(m, src)
}
func (m *FeedCreated) XXX_Size() int {
	return xxx_messageInfo_FeedCreated.Size(m)
}
func (m *FeedCreated) XXX_DiscardUnknown() {
	xxx_messageInfo_FeedCreated.DiscardUnknown(m)
}

var xxx_messageInfo_FeedCreated proto.InternalMessageInfo

func (m *FeedCreated) GetUserId() string {
	if m != nil {
		return m.UserId
	}
	return ""
}

func (m *FeedCreated) GetFeedId() string {
	if m != nil {
		return m.FeedId
	}
	return ""
}

func (m *FeedCreated) GetUrl() string {
	if m != nil {
		return m.Url
	}
	return ""
}

type FeedSubscribed struct {
	UserId               string   `protobuf:"bytes,1,opt,name=user_id,json=userId,proto3" json:"user_id,omitempty"`
	FeedId               string   `protobuf:"bytes,2,opt,name=feed_id,json=feedId,proto3" json:"feed_id,omitempty"`
	FeedSubscriptionId   string   `protobuf:"bytes,3,opt,name=feed_subscription_id,json=feedSubscriptionId,proto3" json:"feed_subscription_id,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *FeedSubscribed) Reset()         { *m = FeedSubscribed{} }
func (m *FeedSubscribed) String() string { return proto.CompactTextString(m) }
func (*FeedSubscribed) ProtoMessage()    {}
func (*FeedSubscribed) Descriptor() ([]byte, []int) {
	return fileDescriptor_8f22242cb04491f9, []int{1}
}

func (m *FeedSubscribed) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_FeedSubscribed.Unmarshal(m, b)
}
func (m *FeedSubscribed) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_FeedSubscribed.Marshal(b, m, deterministic)
}
func (m *FeedSubscribed) XXX_Merge(src proto.Message) {
	xxx_messageInfo_FeedSubscribed.Merge(m, src)
}
func (m *FeedSubscribed) XXX_Size() int {
	return xxx_messageInfo_FeedSubscribed.Size(m)
}
func (m *FeedSubscribed) XXX_DiscardUnknown() {
	xxx_messageInfo_FeedSubscribed.DiscardUnknown(m)
}

var xxx_messageInfo_FeedSubscribed proto.InternalMessageInfo

func (m *FeedSubscribed) GetUserId() string {
	if m != nil {
		return m.UserId
	}
	return ""
}

func (m *FeedSubscribed) GetFeedId() string {
	if m != nil {
		return m.FeedId
	}
	return ""
}

func (m *FeedSubscribed) GetFeedSubscriptionId() string {
	if m != nil {
		return m.FeedSubscriptionId
	}
	return ""
}

type FeedRefreshed struct {
	UserId               string   `protobuf:"bytes,1,opt,name=user_id,json=userId,proto3" json:"user_id,omitempty"`
	FeedId               string   `protobuf:"bytes,2,opt,name=feed_id,json=feedId,proto3" json:"feed_id,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *FeedRefreshed) Reset()         { *m = FeedRefreshed{} }
func (m *FeedRefreshed) String() string { return proto.CompactTextString(m) }
func (*FeedRefreshed) ProtoMessage()    {}
func (*FeedRefreshed) Descriptor() ([]byte, []int) {
	return fileDescriptor_8f22242cb04491f9, []int{2}
}

func (m *FeedRefreshed) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_FeedRefreshed.Unmarshal(m, b)
}
func (m *FeedRefreshed) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_FeedRefreshed.Marshal(b, m, deterministic)
}
func (m *FeedRefreshed) XXX_Merge(src proto.Message) {
	xxx_messageInfo_FeedRefreshed.Merge(m, src)
}
func (m *FeedRefreshed) XXX_Size() int {
	return xxx_messageInfo_FeedRefreshed.Size(m)
}
func (m *FeedRefreshed) XXX_DiscardUnknown() {
	xxx_messageInfo_FeedRefreshed.DiscardUnknown(m)
}

var xxx_messageInfo_FeedRefreshed proto.InternalMessageInfo

func (m *FeedRefreshed) GetUserId() string {
	if m != nil {
		return m.UserId
	}
	return ""
}

func (m *FeedRefreshed) GetFeedId() string {
	if m != nil {
		return m.FeedId
	}
	return ""
}

type FeedOptionsChanged struct {
	UserId               string   `protobuf:"bytes,1,opt,name=user_id,json=userId,proto3" json:"user_id,omitempty"`
	FeedSubscriptionId   string   `protobuf:"bytes,2,opt,name=feed_subscription_id,json=feedSubscriptionId,proto3" json:"feed_subscription_id,omitempty"`
	Autopost             bool     `protobuf:"varint,3,opt,name=autopost,proto3" json:"autopost,omitempty"`
	FeedId               string   `protobuf:"bytes,4,opt,name=feed_id,json=feedId,proto3" json:"feed_id,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *FeedOptionsChanged) Reset()         { *m = FeedOptionsChanged{} }
func (m *FeedOptionsChanged) String() string { return proto.CompactTextString(m) }
func (*FeedOptionsChanged) ProtoMessage()    {}
func (*FeedOptionsChanged) Descriptor() ([]byte, []int) {
	return fileDescriptor_8f22242cb04491f9, []int{3}
}

func (m *FeedOptionsChanged) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_FeedOptionsChanged.Unmarshal(m, b)
}
func (m *FeedOptionsChanged) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_FeedOptionsChanged.Marshal(b, m, deterministic)
}
func (m *FeedOptionsChanged) XXX_Merge(src proto.Message) {
	xxx_messageInfo_FeedOptionsChanged.Merge(m, src)
}
func (m *FeedOptionsChanged) XXX_Size() int {
	return xxx_messageInfo_FeedOptionsChanged.Size(m)
}
func (m *FeedOptionsChanged) XXX_DiscardUnknown() {
	xxx_messageInfo_FeedOptionsChanged.DiscardUnknown(m)
}

var xxx_messageInfo_FeedOptionsChanged proto.InternalMessageInfo

func (m *FeedOptionsChanged) GetUserId() string {
	if m != nil {
		return m.UserId
	}
	return ""
}

func (m *FeedOptionsChanged) GetFeedSubscriptionId() string {
	if m != nil {
		return m.FeedSubscriptionId
	}
	return ""
}

func (m *FeedOptionsChanged) GetAutopost() bool {
	if m != nil {
		return m.Autopost
	}
	return false
}

func (m *FeedOptionsChanged) GetFeedId() string {
	if m != nil {
		return m.FeedId
	}
	return ""
}

type FeedUnsubscribed struct {
	UserId               string   `protobuf:"bytes,1,opt,name=user_id,json=userId,proto3" json:"user_id,omitempty"`
	FeedSubscriptionId   string   `protobuf:"bytes,2,opt,name=feed_subscription_id,json=feedSubscriptionId,proto3" json:"feed_subscription_id,omitempty"`
	FeedId               string   `protobuf:"bytes,3,opt,name=feed_id,json=feedId,proto3" json:"feed_id,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *FeedUnsubscribed) Reset()         { *m = FeedUnsubscribed{} }
func (m *FeedUnsubscribed) String() string { return proto.CompactTextString(m) }
func (*FeedUnsubscribed) ProtoMessage()    {}
func (*FeedUnsubscribed) Descriptor() ([]byte, []int) {
	return fileDescriptor_8f22242cb04491f9, []int{4}
}

func (m *FeedUnsubscribed) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_FeedUnsubscribed.Unmarshal(m, b)
}
func (m *FeedUnsubscribed) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_FeedUnsubscribed.Marshal(b, m, deterministic)
}
func (m *FeedUnsubscribed) XXX_Merge(src proto.Message) {
	xxx_messageInfo_FeedUnsubscribed.Merge(m, src)
}
func (m *FeedUnsubscribed) XXX_Size() int {
	return xxx_messageInfo_FeedUnsubscribed.Size(m)
}
func (m *FeedUnsubscribed) XXX_DiscardUnknown() {
	xxx_messageInfo_FeedUnsubscribed.DiscardUnknown(m)
}

var xxx_messageInfo_FeedUnsubscribed proto.InternalMessageInfo

func (m *FeedUnsubscribed) GetUserId() string {
	if m != nil {
		return m.UserId
	}
	return ""
}

func (m *FeedUnsubscribed) GetFeedSubscriptionId() string {
	if m != nil {
		return m.FeedSubscriptionId
	}
	return ""
}

func (m *FeedUnsubscribed) GetFeedId() string {
	if m != nil {
		return m.FeedId
	}
	return ""
}

type PostsImported struct {
	FeedId               string   `protobuf:"bytes,1,opt,name=feed_id,json=feedId,proto3" json:"feed_id,omitempty"`
	PostIds              []string `protobuf:"bytes,2,rep,name=post_ids,json=postIds,proto3" json:"post_ids,omitempty"`
	OldestPublishedAt    string   `protobuf:"bytes,3,opt,name=oldest_published_at,json=oldestPublishedAt,proto3" json:"oldest_published_at,omitempty"`
	UserId               string   `protobuf:"bytes,4,opt,name=user_id,json=userId,proto3" json:"user_id,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *PostsImported) Reset()         { *m = PostsImported{} }
func (m *PostsImported) String() string { return proto.CompactTextString(m) }
func (*PostsImported) ProtoMessage()    {}
func (*PostsImported) Descriptor() ([]byte, []int) {
	return fileDescriptor_8f22242cb04491f9, []int{5}
}

func (m *PostsImported) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_PostsImported.Unmarshal(m, b)
}
func (m *PostsImported) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_PostsImported.Marshal(b, m, deterministic)
}
func (m *PostsImported) XXX_Merge(src proto.Message) {
	xxx_messageInfo_PostsImported.Merge(m, src)
}
func (m *PostsImported) XXX_Size() int {
	return xxx_messageInfo_PostsImported.Size(m)
}
func (m *PostsImported) XXX_DiscardUnknown() {
	xxx_messageInfo_PostsImported.DiscardUnknown(m)
}

var xxx_messageInfo_PostsImported proto.InternalMessageInfo

func (m *PostsImported) GetFeedId() string {
	if m != nil {
		return m.FeedId
	}
	return ""
}

func (m *PostsImported) GetPostIds() []string {
	if m != nil {
		return m.PostIds
	}
	return nil
}

func (m *PostsImported) GetOldestPublishedAt() string {
	if m != nil {
		return m.OldestPublishedAt
	}
	return ""
}

func (m *PostsImported) GetUserId() string {
	if m != nil {
		return m.UserId
	}
	return ""
}

type FeedPurged struct {
	UserId               string   `protobuf:"bytes,1,opt,name=user_id,json=userId,proto3" json:"user_id,omitempty"`
	FeedId               string   `protobuf:"bytes,2,opt,name=feed_id,json=feedId,proto3" json:"feed_id,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *FeedPurged) Reset()         { *m = FeedPurged{} }
func (m *FeedPurged) String() string { return proto.CompactTextString(m) }
func (*FeedPurged) ProtoMessage()    {}
func (*FeedPurged) Descriptor() ([]byte, []int) {
	return fileDescriptor_8f22242cb04491f9, []int{6}
}

func (m *FeedPurged) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_FeedPurged.Unmarshal(m, b)
}
func (m *FeedPurged) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_FeedPurged.Marshal(b, m, deterministic)
}
func (m *FeedPurged) XXX_Merge(src proto.Message) {
	xxx_messageInfo_FeedPurged.Merge(m, src)
}
func (m *FeedPurged) XXX_Size() int {
	return xxx_messageInfo_FeedPurged.Size(m)
}
func (m *FeedPurged) XXX_DiscardUnknown() {
	xxx_messageInfo_FeedPurged.DiscardUnknown(m)
}

var xxx_messageInfo_FeedPurged proto.InternalMessageInfo

func (m *FeedPurged) GetUserId() string {
	if m != nil {
		return m.UserId
	}
	return ""
}

func (m *FeedPurged) GetFeedId() string {
	if m != nil {
		return m.FeedId
	}
	return ""
}

type PostsPurged struct {
	UserId               string   `protobuf:"bytes,1,opt,name=user_id,json=userId,proto3" json:"user_id,omitempty"`
	FeedId               string   `protobuf:"bytes,2,opt,name=feed_id,json=feedId,proto3" json:"feed_id,omitempty"`
	PostCount            int64    `protobuf:"varint,3,opt,name=post_count,json=postCount,proto3" json:"post_count,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *PostsPurged) Reset()         { *m = PostsPurged{} }
func (m *PostsPurged) String() string { return proto.CompactTextString(m) }
func (*PostsPurged) ProtoMessage()    {}
func (*PostsPurged) Descriptor() ([]byte, []int) {
	return fileDescriptor_8f22242cb04491f9, []int{7}
}

func (m *PostsPurged) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_PostsPurged.Unmarshal(m, b)
}
func (m *PostsPurged) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_PostsPurged.Marshal(b, m, deterministic)
}
func (m *PostsPurged) XXX_Merge(src proto.Message) {
	xxx_messageInfo_PostsPurged.Merge(m, src)
}
func (m *PostsPurged) XXX_Size() int {
	return xxx_messageInfo_PostsPurged.Size(m)
}
func (m *PostsPurged) XXX_DiscardUnknown() {
	xxx_messageInfo_PostsPurged.DiscardUnknown(m)
}

var xxx_messageInfo_PostsPurged proto.InternalMessageInfo

func (m *PostsPurged) GetUserId() string {
	if m != nil {
		return m.UserId
	}
	return ""
}

func (m *PostsPurged) GetFeedId() string {
	if m != nil {
		return m.FeedId
	}
	return ""
}

func (m *PostsPurged) GetPostCount() int64 {
	if m != nil {
		return m.PostCount
	}
	return 0
}

func init() {
	proto.RegisterType((*FeedCreated)(nil), "courier.feeds.FeedCreated")
	proto.RegisterType((*FeedSubscribed)(nil), "courier.feeds.FeedSubscribed")
	proto.RegisterType((*FeedRefreshed)(nil), "courier.feeds.FeedRefreshed")
	proto.RegisterType((*FeedOptionsChanged)(nil), "courier.feeds.FeedOptionsChanged")
	proto.RegisterType((*FeedUnsubscribed)(nil), "courier.feeds.FeedUnsubscribed")
	proto.RegisterType((*PostsImported)(nil), "courier.feeds.PostsImported")
	proto.RegisterType((*FeedPurged)(nil), "courier.feeds.FeedPurged")
	proto.RegisterType((*PostsPurged)(nil), "courier.feeds.PostsPurged")
}

func init() { proto.RegisterFile("events.proto", fileDescriptor_8f22242cb04491f9) }

var fileDescriptor_8f22242cb04491f9 = []byte{
	// 352 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0x9c, 0x53, 0x4f, 0x4b, 0xeb, 0x40,
	0x10, 0x27, 0x4d, 0x5f, 0xff, 0x4c, 0x5f, 0x1f, 0x7d, 0xab, 0x60, 0x15, 0x84, 0x92, 0x53, 0x4f,
	0x45, 0xf0, 0x2e, 0xd4, 0x82, 0x90, 0x93, 0x35, 0xe2, 0xc5, 0x83, 0x21, 0xe9, 0x4e, 0xdb, 0x40,
	0xcd, 0x86, 0x9d, 0xdd, 0x7e, 0x0a, 0x8f, 0x7e, 0x60, 0x99, 0x4d, 0xab, 0xe9, 0xa1, 0xa2, 0xb9,
	0x65, 0xe6, 0xb7, 0xf9, 0xfd, 0xd9, 0xd9, 0x81, 0xbf, 0xb8, 0xc5, 0xdc, 0xd0, 0xa4, 0xd0, 0xca,
	0x28, 0xd1, 0x5f, 0x28, 0xab, 0x33, 0xd4, 0x93, 0x25, 0xa2, 0xa4, 0xe0, 0x01, 0x7a, 0x77, 0x88,
	0x72, 0xa6, 0x31, 0x31, 0x28, 0xc5, 0x19, 0xb4, 0x2d, 0xa1, 0x8e, 0x33, 0x39, 0xf4, 0x46, 0xde,
	0xb8, 0x1b, 0xb5, 0xb8, 0x0c, 0x1d, 0xc0, 0x3f, 0x30, 0xd0, 0x28, 0x01, 0x2e, 0x43, 0x29, 0x06,
	0xe0, 0x5b, 0xbd, 0x19, 0xfa, 0xae, 0xc9, 0x9f, 0x81, 0x81, 0x7f, 0x4c, 0xf9, 0x68, 0x53, 0x5a,
	0xe8, 0x2c, 0xad, 0xc5, 0x7a, 0x05, 0xa7, 0x0e, 0xa0, 0x92, 0xa4, 0x30, 0x99, 0xca, 0xf9, 0x54,
	0x29, 0x23, 0x96, 0x5f, 0xfc, 0x0e, 0x0a, 0x65, 0x30, 0x85, 0x3e, 0xab, 0x46, 0xb8, 0xd4, 0x48,
	0xeb, 0x3a, 0xa2, 0xc1, 0xbb, 0x07, 0x82, 0x39, 0xee, 0x1d, 0x27, 0xcd, 0xd6, 0x49, 0xbe, 0xfa,
	0x8e, 0xe8, 0x98, 0xc9, 0xc6, 0x31, 0x93, 0xe2, 0x02, 0x3a, 0x89, 0x35, 0xaa, 0x50, 0x64, 0x5c,
	0x94, 0x4e, 0xf4, 0x59, 0x57, 0x6d, 0x35, 0x0f, 0x6c, 0x6d, 0x61, 0xc0, 0xae, 0x9e, 0x72, 0xfa,
	0xc1, 0x8d, 0xfe, 0xde, 0x53, 0x45, 0xd7, 0x3f, 0xd0, 0x7d, 0xf3, 0xa0, 0x3f, 0x57, 0x64, 0x28,
	0x7c, 0x2d, 0x94, 0xde, 0xbd, 0x8e, 0xfd, 0x51, 0xef, 0x60, 0x5c, 0xe7, 0xd0, 0xe1, 0x0c, 0x71,
	0x26, 0x69, 0xd8, 0x18, 0xf9, 0xe3, 0x6e, 0xd4, 0xe6, 0x3a, 0x94, 0x24, 0x26, 0x70, 0xa2, 0x36,
	0x12, 0xc9, 0xc4, 0x85, 0x4d, 0x37, 0x19, 0x8f, 0x26, 0x4e, 0xcc, 0x4e, 0xea, 0x7f, 0x09, 0xcd,
	0xf7, 0xc8, 0xd4, 0x54, 0x93, 0x35, 0xab, 0xc9, 0x82, 0x1b, 0x00, 0xbe, 0x86, 0xb9, 0xd5, 0xab,
	0x5a, 0xd3, 0x7d, 0x81, 0x9e, 0x4b, 0x53, 0x97, 0x40, 0x5c, 0x02, 0xb8, 0x90, 0x0b, 0x65, 0xf3,
	0x32, 0x80, 0x1f, 0x75, 0xb9, 0x33, 0xe3, 0xc6, 0x6d, 0xfb, 0xf9, 0x8f, 0x5b, 0xa9, 0xb4, 0xe5,
	0x16, 0xed, 0xfa, 0x23, 0x00, 0x00, 0xff, 0xff, 0xea, 0x9a, 0x85, 0x2c, 0x78, 0x03, 0x00, 0x00,
}
