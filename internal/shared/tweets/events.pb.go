// Code generated by protoc-gen-go. DO NOT EDIT.
// source: events.proto

package tweets

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

type TweetCanceled struct {
	UserId               string   `protobuf:"bytes,1,opt,name=user_id,json=userId,proto3" json:"user_id,omitempty"`
	TweetId              string   `protobuf:"bytes,2,opt,name=tweet_id,json=tweetId,proto3" json:"tweet_id,omitempty"`
	FeedId               string   `protobuf:"bytes,3,opt,name=feed_id,json=feedId,proto3" json:"feed_id,omitempty"`
	ItemId               string   `protobuf:"bytes,4,opt,name=item_id,json=itemId,proto3" json:"item_id,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *TweetCanceled) Reset()         { *m = TweetCanceled{} }
func (m *TweetCanceled) String() string { return proto.CompactTextString(m) }
func (*TweetCanceled) ProtoMessage()    {}
func (*TweetCanceled) Descriptor() ([]byte, []int) {
	return fileDescriptor_8f22242cb04491f9, []int{0}
}

func (m *TweetCanceled) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_TweetCanceled.Unmarshal(m, b)
}
func (m *TweetCanceled) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_TweetCanceled.Marshal(b, m, deterministic)
}
func (m *TweetCanceled) XXX_Merge(src proto.Message) {
	xxx_messageInfo_TweetCanceled.Merge(m, src)
}
func (m *TweetCanceled) XXX_Size() int {
	return xxx_messageInfo_TweetCanceled.Size(m)
}
func (m *TweetCanceled) XXX_DiscardUnknown() {
	xxx_messageInfo_TweetCanceled.DiscardUnknown(m)
}

var xxx_messageInfo_TweetCanceled proto.InternalMessageInfo

func (m *TweetCanceled) GetUserId() string {
	if m != nil {
		return m.UserId
	}
	return ""
}

func (m *TweetCanceled) GetTweetId() string {
	if m != nil {
		return m.TweetId
	}
	return ""
}

func (m *TweetCanceled) GetFeedId() string {
	if m != nil {
		return m.FeedId
	}
	return ""
}

func (m *TweetCanceled) GetItemId() string {
	if m != nil {
		return m.ItemId
	}
	return ""
}

type TweetUncanceled struct {
	UserId               string   `protobuf:"bytes,1,opt,name=user_id,json=userId,proto3" json:"user_id,omitempty"`
	TweetId              string   `protobuf:"bytes,2,opt,name=tweet_id,json=tweetId,proto3" json:"tweet_id,omitempty"`
	FeedId               string   `protobuf:"bytes,3,opt,name=feed_id,json=feedId,proto3" json:"feed_id,omitempty"`
	ItemId               string   `protobuf:"bytes,4,opt,name=item_id,json=itemId,proto3" json:"item_id,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *TweetUncanceled) Reset()         { *m = TweetUncanceled{} }
func (m *TweetUncanceled) String() string { return proto.CompactTextString(m) }
func (*TweetUncanceled) ProtoMessage()    {}
func (*TweetUncanceled) Descriptor() ([]byte, []int) {
	return fileDescriptor_8f22242cb04491f9, []int{1}
}

func (m *TweetUncanceled) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_TweetUncanceled.Unmarshal(m, b)
}
func (m *TweetUncanceled) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_TweetUncanceled.Marshal(b, m, deterministic)
}
func (m *TweetUncanceled) XXX_Merge(src proto.Message) {
	xxx_messageInfo_TweetUncanceled.Merge(m, src)
}
func (m *TweetUncanceled) XXX_Size() int {
	return xxx_messageInfo_TweetUncanceled.Size(m)
}
func (m *TweetUncanceled) XXX_DiscardUnknown() {
	xxx_messageInfo_TweetUncanceled.DiscardUnknown(m)
}

var xxx_messageInfo_TweetUncanceled proto.InternalMessageInfo

func (m *TweetUncanceled) GetUserId() string {
	if m != nil {
		return m.UserId
	}
	return ""
}

func (m *TweetUncanceled) GetTweetId() string {
	if m != nil {
		return m.TweetId
	}
	return ""
}

func (m *TweetUncanceled) GetFeedId() string {
	if m != nil {
		return m.FeedId
	}
	return ""
}

func (m *TweetUncanceled) GetItemId() string {
	if m != nil {
		return m.ItemId
	}
	return ""
}

type TweetEdited struct {
	UserId               string   `protobuf:"bytes,1,opt,name=user_id,json=userId,proto3" json:"user_id,omitempty"`
	TweetId              string   `protobuf:"bytes,2,opt,name=tweet_id,json=tweetId,proto3" json:"tweet_id,omitempty"`
	FeedId               string   `protobuf:"bytes,3,opt,name=feed_id,json=feedId,proto3" json:"feed_id,omitempty"`
	ItemId               string   `protobuf:"bytes,4,opt,name=item_id,json=itemId,proto3" json:"item_id,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *TweetEdited) Reset()         { *m = TweetEdited{} }
func (m *TweetEdited) String() string { return proto.CompactTextString(m) }
func (*TweetEdited) ProtoMessage()    {}
func (*TweetEdited) Descriptor() ([]byte, []int) {
	return fileDescriptor_8f22242cb04491f9, []int{2}
}

func (m *TweetEdited) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_TweetEdited.Unmarshal(m, b)
}
func (m *TweetEdited) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_TweetEdited.Marshal(b, m, deterministic)
}
func (m *TweetEdited) XXX_Merge(src proto.Message) {
	xxx_messageInfo_TweetEdited.Merge(m, src)
}
func (m *TweetEdited) XXX_Size() int {
	return xxx_messageInfo_TweetEdited.Size(m)
}
func (m *TweetEdited) XXX_DiscardUnknown() {
	xxx_messageInfo_TweetEdited.DiscardUnknown(m)
}

var xxx_messageInfo_TweetEdited proto.InternalMessageInfo

func (m *TweetEdited) GetUserId() string {
	if m != nil {
		return m.UserId
	}
	return ""
}

func (m *TweetEdited) GetTweetId() string {
	if m != nil {
		return m.TweetId
	}
	return ""
}

func (m *TweetEdited) GetFeedId() string {
	if m != nil {
		return m.FeedId
	}
	return ""
}

func (m *TweetEdited) GetItemId() string {
	if m != nil {
		return m.ItemId
	}
	return ""
}

type TweetPosted struct {
	UserId               string   `protobuf:"bytes,1,opt,name=user_id,json=userId,proto3" json:"user_id,omitempty"`
	TweetId              string   `protobuf:"bytes,2,opt,name=tweet_id,json=tweetId,proto3" json:"tweet_id,omitempty"`
	Autoposted           bool     `protobuf:"varint,3,opt,name=autoposted,proto3" json:"autoposted,omitempty"`
	FeedId               string   `protobuf:"bytes,4,opt,name=feed_id,json=feedId,proto3" json:"feed_id,omitempty"`
	ItemId               string   `protobuf:"bytes,5,opt,name=item_id,json=itemId,proto3" json:"item_id,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *TweetPosted) Reset()         { *m = TweetPosted{} }
func (m *TweetPosted) String() string { return proto.CompactTextString(m) }
func (*TweetPosted) ProtoMessage()    {}
func (*TweetPosted) Descriptor() ([]byte, []int) {
	return fileDescriptor_8f22242cb04491f9, []int{3}
}

func (m *TweetPosted) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_TweetPosted.Unmarshal(m, b)
}
func (m *TweetPosted) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_TweetPosted.Marshal(b, m, deterministic)
}
func (m *TweetPosted) XXX_Merge(src proto.Message) {
	xxx_messageInfo_TweetPosted.Merge(m, src)
}
func (m *TweetPosted) XXX_Size() int {
	return xxx_messageInfo_TweetPosted.Size(m)
}
func (m *TweetPosted) XXX_DiscardUnknown() {
	xxx_messageInfo_TweetPosted.DiscardUnknown(m)
}

var xxx_messageInfo_TweetPosted proto.InternalMessageInfo

func (m *TweetPosted) GetUserId() string {
	if m != nil {
		return m.UserId
	}
	return ""
}

func (m *TweetPosted) GetTweetId() string {
	if m != nil {
		return m.TweetId
	}
	return ""
}

func (m *TweetPosted) GetAutoposted() bool {
	if m != nil {
		return m.Autoposted
	}
	return false
}

func (m *TweetPosted) GetFeedId() string {
	if m != nil {
		return m.FeedId
	}
	return ""
}

func (m *TweetPosted) GetItemId() string {
	if m != nil {
		return m.ItemId
	}
	return ""
}

type TweetsImported struct {
	UserId               string   `protobuf:"bytes,1,opt,name=user_id,json=userId,proto3" json:"user_id,omitempty"`
	SubscriptionId       string   `protobuf:"bytes,2,opt,name=subscription_id,json=subscriptionId,proto3" json:"subscription_id,omitempty"`
	CreatedItemIds       []string `protobuf:"bytes,3,rep,name=created_item_ids,json=createdItemIds,proto3" json:"created_item_ids,omitempty"`
	UpdatedItemIds       []string `protobuf:"bytes,4,rep,name=updated_item_ids,json=updatedItemIds,proto3" json:"updated_item_ids,omitempty"`
	Autopost             bool     `protobuf:"varint,5,opt,name=autopost,proto3" json:"autopost,omitempty"`
	FeedId               string   `protobuf:"bytes,6,opt,name=feed_id,json=feedId,proto3" json:"feed_id,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *TweetsImported) Reset()         { *m = TweetsImported{} }
func (m *TweetsImported) String() string { return proto.CompactTextString(m) }
func (*TweetsImported) ProtoMessage()    {}
func (*TweetsImported) Descriptor() ([]byte, []int) {
	return fileDescriptor_8f22242cb04491f9, []int{4}
}

func (m *TweetsImported) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_TweetsImported.Unmarshal(m, b)
}
func (m *TweetsImported) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_TweetsImported.Marshal(b, m, deterministic)
}
func (m *TweetsImported) XXX_Merge(src proto.Message) {
	xxx_messageInfo_TweetsImported.Merge(m, src)
}
func (m *TweetsImported) XXX_Size() int {
	return xxx_messageInfo_TweetsImported.Size(m)
}
func (m *TweetsImported) XXX_DiscardUnknown() {
	xxx_messageInfo_TweetsImported.DiscardUnknown(m)
}

var xxx_messageInfo_TweetsImported proto.InternalMessageInfo

func (m *TweetsImported) GetUserId() string {
	if m != nil {
		return m.UserId
	}
	return ""
}

func (m *TweetsImported) GetSubscriptionId() string {
	if m != nil {
		return m.SubscriptionId
	}
	return ""
}

func (m *TweetsImported) GetCreatedItemIds() []string {
	if m != nil {
		return m.CreatedItemIds
	}
	return nil
}

func (m *TweetsImported) GetUpdatedItemIds() []string {
	if m != nil {
		return m.UpdatedItemIds
	}
	return nil
}

func (m *TweetsImported) GetAutopost() bool {
	if m != nil {
		return m.Autopost
	}
	return false
}

func (m *TweetsImported) GetFeedId() string {
	if m != nil {
		return m.FeedId
	}
	return ""
}

func init() {
	proto.RegisterType((*TweetCanceled)(nil), "courier.tweets.TweetCanceled")
	proto.RegisterType((*TweetUncanceled)(nil), "courier.tweets.TweetUncanceled")
	proto.RegisterType((*TweetEdited)(nil), "courier.tweets.TweetEdited")
	proto.RegisterType((*TweetPosted)(nil), "courier.tweets.TweetPosted")
	proto.RegisterType((*TweetsImported)(nil), "courier.tweets.TweetsImported")
}

func init() { proto.RegisterFile("events.proto", fileDescriptor_8f22242cb04491f9) }

var fileDescriptor_8f22242cb04491f9 = []byte{
	// 288 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0xbc, 0x92, 0xb1, 0x4e, 0xc3, 0x30,
	0x10, 0x86, 0x15, 0x1a, 0xd2, 0x70, 0x40, 0x8a, 0xb2, 0x50, 0x18, 0x50, 0xd5, 0x85, 0x4e, 0x5d,
	0x78, 0x03, 0x10, 0x83, 0x37, 0x14, 0xc1, 0xc2, 0x82, 0xd2, 0xf8, 0x90, 0x2c, 0xd1, 0x38, 0xf2,
	0xd9, 0xf4, 0x41, 0x78, 0x3c, 0x5e, 0x06, 0xdd, 0x39, 0x85, 0x74, 0x80, 0x81, 0xa1, 0x5b, 0xfe,
	0xfb, 0xff, 0xcb, 0xf7, 0x9f, 0x64, 0x38, 0xc1, 0x77, 0x6c, 0x3d, 0x2d, 0x3b, 0x67, 0xbd, 0x2d,
	0x8b, 0xc6, 0x06, 0x67, 0xd0, 0x2d, 0xfd, 0x06, 0xd1, 0xd3, 0x3c, 0xc0, 0xe9, 0x23, 0x7f, 0xdd,
	0xd5, 0x6d, 0x83, 0x6f, 0xa8, 0xcb, 0x73, 0x18, 0x07, 0x42, 0xf7, 0x62, 0xf4, 0x34, 0x99, 0x25,
	0x8b, 0xa3, 0x2a, 0x63, 0xa9, 0x74, 0x79, 0x01, 0xb9, 0xec, 0xb0, 0x73, 0x20, 0xce, 0x58, 0xb4,
	0x92, 0x9d, 0x57, 0x44, 0xcd, 0xce, 0x28, 0xee, 0xb0, 0x8c, 0x86, 0xf1, 0xb8, 0x66, 0x23, 0x8d,
	0x06, 0x4b, 0xa5, 0xe7, 0x1b, 0x98, 0x08, 0xf6, 0xa9, 0x6d, 0xf6, 0x0b, 0x26, 0x38, 0x16, 0xf0,
	0xbd, 0x36, 0x7e, 0x6f, 0xd0, 0x8f, 0xa4, 0xa7, 0x3e, 0x58, 0xfa, 0x2f, 0xf5, 0x0a, 0xa0, 0x0e,
	0xde, 0x76, 0xf2, 0x07, 0x01, 0xe7, 0xd5, 0x60, 0x32, 0x6c, 0x95, 0xfe, 0xd6, 0xea, 0x70, 0xa7,
	0xd5, 0x67, 0x02, 0x85, 0xb4, 0x22, 0xb5, 0xee, 0xac, 0xfb, 0xb3, 0xd8, 0x35, 0x4c, 0x28, 0xac,
	0xa8, 0x71, 0xa6, 0xf3, 0xc6, 0xb6, 0x3f, 0xfd, 0x8a, 0xe1, 0x58, 0xe9, 0x72, 0x01, 0x67, 0x8d,
	0xc3, 0xda, 0x73, 0x93, 0x48, 0xa5, 0xe9, 0x68, 0x36, 0xe2, 0x64, 0x3f, 0x57, 0x42, 0x27, 0x4e,
	0x86, 0x4e, 0xef, 0x26, 0xd3, 0x98, 0xec, 0xe7, 0xdb, 0xe4, 0x25, 0xe4, 0xdb, 0x43, 0xe5, 0x84,
	0xbc, 0xfa, 0xd6, 0xc3, 0xb3, 0xb3, 0xe1, 0xd9, 0xb7, 0xf9, 0x73, 0x16, 0x9f, 0xf8, 0x2a, 0x93,
	0x97, 0x7f, 0xf3, 0x15, 0x00, 0x00, 0xff, 0xff, 0x7f, 0x08, 0x86, 0x9f, 0x09, 0x03, 0x00, 0x00,
}
