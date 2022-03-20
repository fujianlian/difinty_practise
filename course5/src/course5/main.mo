import Iter "mo:base/Iter";
import List "mo:base/List";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor {
    public type Message = {
        text : Text;
        time : Time.Time;
        author: Text;
    };

    public type FollowInfo = {
        name : ?Text;
        cid : Text;
    };

    public type Microblog = actor {
        follow: shared(Principal) -> async ();
        follows: shared query () -> async [Principal];
        get_follow_infos: shared () -> async [FollowInfo];
        post: shared (Text,Text) -> async ();
        posts: shared query (since: Time.Time) -> async [Message];
        timeline: shared (since: Time.Time) -> async [Message];
        set_name: shared (Text) -> async ();
        get_name: shared query () -> async ?Text;
    };

    stable var followed : List.List<Principal> = List.nil();

    public shared func follow(id: Principal) : async () {
        followed := List.push(id, followed);
    };

    public shared query func follows() : async [Principal] {
        List.toArray(followed)
    };

    public shared func get_follow_infos() : async [FollowInfo] {
        var lists : List.List<FollowInfo> = List.nil();   
        for (id in Iter.fromList(followed)) {
            let canister : Microblog = actor(Principal.toText(id));
            let ms = await canister.get_name();
            let info : FollowInfo = {name=ms;cid=Principal.toText(id)};
            lists := List.push(info,lists);
        };
        List.toArray(lists)
    };

    stable var messages : List.List<Message> = List.nil();
    
    public shared func post(otp: Text, text: Text) : async () {
        assert (otp=="123456");
        let message : Message = { text=text; time = Time.now(); author = name};
        messages := List.push(message, messages)
    };

    public shared query func posts(since: Time.Time) : async [Message] {
        var res : List.List<Message> = List.nil();
        for(msg in Iter.fromList(messages)){
            if(msg.time > since){
                res := List.push(msg, res);
            };
        };
        List.toArray(res)
    };

    public shared func timeline(since: Time.Time) : async [Message] {
        var all : List.List<Message> = List.nil();
        for (id in Iter.fromList(followed)) {
            let canister : Microblog = actor(Principal.toText(id));
            let msgs = await canister.posts(since);
            for (msg in Iter.fromArray(msgs)) {
                all := List.push(msg, all);
            }
        };
        List.toArray(all)
    };

    stable var name : Text = "nil";

    public shared (msg) func set_name(text : Text) : async () {
        name := text;
    };

    public shared query func get_name() : async Text {
        name
    };

    
};