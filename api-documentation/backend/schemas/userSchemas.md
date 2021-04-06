# **Schemas**
___  

## *User*

### **User Schema**

```JSON5
    {
        username: String,
        email: String,
        password: String,
        fullname: String,
        about: String,
        profileImage: String,
        isBanned: Boolean,
        savedPedia: [Pedia],
        savedBlog: [Blog],
        upvotedBlog: [Blog],
        downvotedBlog: [Blog],
        savedEvent: [Event],
        enrolledEvent: [Event],
        forumPost: [Post],
        upvotedPost: [Post],
        downvotedPost: [Post],
        tokens: [{
        	token: String
        }]
    }
```  


### **TravelAgency Schema**

```JSON5
    {
        username: String,
        email: String,
        password: String,
        fullname: String,
        about: String,
        profileImage: String,
        isBanned: Boolean,
        event: [Event],
        guide: [Guide],
        category: [Category],
        tokens: [{
        	token: String
        }]
    }
```  


### **Guide Schema**

```JSON5
    {
        username: String,
        email: String,
        password: String,
        fullname: String,
        about: String,
        profileImage: String,
        isBanned: Boolean,
        guidedEvent: [Event],
        travelAgency: TravelAgency,
        tokens: [{
        	token: String
        }]
    }
```  


### **Admin Schema**

```JSON5
    {
        email: String,
        password: String,
        fullname: String,
        tokens: [{
        	token: String
        }]
    }
```  
