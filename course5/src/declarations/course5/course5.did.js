export const idlFactory = ({ IDL }) => {
  const FollowInfo = IDL.Record({
    'cid' : IDL.Text,
    'name' : IDL.Opt(IDL.Text),
  });
  const Time = IDL.Int;
  const Message = IDL.Record({
    'text' : IDL.Text,
    'time' : Time,
    'author' : IDL.Text,
  });
  return IDL.Service({
    'follow' : IDL.Func([IDL.Principal], [], []),
    'follows' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    'get_follow_infos' : IDL.Func([], [IDL.Vec(FollowInfo)], []),
    'get_name' : IDL.Func([], [IDL.Text], ['query']),
    'post' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'posts' : IDL.Func([Time], [IDL.Vec(Message)], ['query']),
    'set_name' : IDL.Func([IDL.Text], [], []),
    'timeline' : IDL.Func([Time], [IDL.Vec(Message)], []),
  });
};
export const init = ({ IDL }) => { return []; };
