// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.23.0-devel
// 	protoc        v3.12.0
// source: tasks.proto

package tasks

import (
	proto "github.com/golang/protobuf/proto"
	any "github.com/golang/protobuf/ptypes/any"
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	reflect "reflect"
	sync "sync"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

// This is a compile-time assertion that a sufficiently up-to-date version
// of the legacy proto package is being used.
const _ = proto.ProtoPackageIsVersion4

type FireTaskEvent struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Name string   `protobuf:"bytes,1,opt,name=name,proto3" json:"name,omitempty"`
	Task *any.Any `protobuf:"bytes,2,opt,name=task,proto3" json:"task,omitempty"`
}

func (x *FireTaskEvent) Reset() {
	*x = FireTaskEvent{}
	if protoimpl.UnsafeEnabled {
		mi := &file_tasks_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *FireTaskEvent) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*FireTaskEvent) ProtoMessage() {}

func (x *FireTaskEvent) ProtoReflect() protoreflect.Message {
	mi := &file_tasks_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use FireTaskEvent.ProtoReflect.Descriptor instead.
func (*FireTaskEvent) Descriptor() ([]byte, []int) {
	return file_tasks_proto_rawDescGZIP(), []int{0}
}

func (x *FireTaskEvent) GetName() string {
	if x != nil {
		return x.Name
	}
	return ""
}

func (x *FireTaskEvent) GetTask() *any.Any {
	if x != nil {
		return x.Task
	}
	return nil
}

var File_tasks_proto protoreflect.FileDescriptor

var file_tasks_proto_rawDesc = []byte{
	0x0a, 0x0b, 0x74, 0x61, 0x73, 0x6b, 0x73, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x12, 0x0d, 0x63,
	0x6f, 0x75, 0x72, 0x69, 0x65, 0x72, 0x2e, 0x74, 0x61, 0x73, 0x6b, 0x73, 0x1a, 0x19, 0x67, 0x6f,
	0x6f, 0x67, 0x6c, 0x65, 0x2f, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x62, 0x75, 0x66, 0x2f, 0x61, 0x6e,
	0x79, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x22, 0x4d, 0x0a, 0x0d, 0x46, 0x69, 0x72, 0x65, 0x54,
	0x61, 0x73, 0x6b, 0x45, 0x76, 0x65, 0x6e, 0x74, 0x12, 0x12, 0x0a, 0x04, 0x6e, 0x61, 0x6d, 0x65,
	0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x04, 0x6e, 0x61, 0x6d, 0x65, 0x12, 0x28, 0x0a, 0x04,
	0x74, 0x61, 0x73, 0x6b, 0x18, 0x02, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x14, 0x2e, 0x67, 0x6f, 0x6f,
	0x67, 0x6c, 0x65, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x62, 0x75, 0x66, 0x2e, 0x41, 0x6e, 0x79,
	0x52, 0x04, 0x74, 0x61, 0x73, 0x6b, 0x42, 0x07, 0x5a, 0x05, 0x74, 0x61, 0x73, 0x6b, 0x73, 0x62,
	0x06, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x33,
}

var (
	file_tasks_proto_rawDescOnce sync.Once
	file_tasks_proto_rawDescData = file_tasks_proto_rawDesc
)

func file_tasks_proto_rawDescGZIP() []byte {
	file_tasks_proto_rawDescOnce.Do(func() {
		file_tasks_proto_rawDescData = protoimpl.X.CompressGZIP(file_tasks_proto_rawDescData)
	})
	return file_tasks_proto_rawDescData
}

var file_tasks_proto_msgTypes = make([]protoimpl.MessageInfo, 1)
var file_tasks_proto_goTypes = []interface{}{
	(*FireTaskEvent)(nil), // 0: courier.tasks.FireTaskEvent
	(*any.Any)(nil),       // 1: google.protobuf.Any
}
var file_tasks_proto_depIdxs = []int32{
	1, // 0: courier.tasks.FireTaskEvent.task:type_name -> google.protobuf.Any
	1, // [1:1] is the sub-list for method output_type
	1, // [1:1] is the sub-list for method input_type
	1, // [1:1] is the sub-list for extension type_name
	1, // [1:1] is the sub-list for extension extendee
	0, // [0:1] is the sub-list for field type_name
}

func init() { file_tasks_proto_init() }
func file_tasks_proto_init() {
	if File_tasks_proto != nil {
		return
	}
	if !protoimpl.UnsafeEnabled {
		file_tasks_proto_msgTypes[0].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*FireTaskEvent); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_tasks_proto_rawDesc,
			NumEnums:      0,
			NumMessages:   1,
			NumExtensions: 0,
			NumServices:   0,
		},
		GoTypes:           file_tasks_proto_goTypes,
		DependencyIndexes: file_tasks_proto_depIdxs,
		MessageInfos:      file_tasks_proto_msgTypes,
	}.Build()
	File_tasks_proto = out.File
	file_tasks_proto_rawDesc = nil
	file_tasks_proto_goTypes = nil
	file_tasks_proto_depIdxs = nil
}
