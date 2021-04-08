# **Routes**

---

## **User Routes**

### Base Route - '/user'

 ---

## **User Authentication & Profile Related Routes**

## *User, TravelAgency & Guide*

### Base Route For User - '/general'
### Base Route For TravelAgency - '/travelagency'
### Base Route For Guide - '/guide/'

### **1. POST - '/signup'**

**Request**

*Body*

```JSON5
    {
    	username: String,
    	email: String,                        
       	password: String,
       	fullname: String,
    }
```  

**Response**

```JSON5
    {
    	username: String,
        fullname: String,
        about: String,
        profileImage: String,
        isBanned: Boolean,
    	token: String,
    }
```

---

### **2. POST - '/signin'**

**Request**

*Body*

```JSON5
    {
    	email: String,                        
       	password: String,
    }
```  

**Response**

```JSON5
    {
    	username: String,
        fullname: String,
        about: String,
        profileImage: String,
        isBanned: Boolean,
    	token: String,
    }
```

---

### **3. GET - '/signout'**

**Request**

*Header*
	
	Authorization: BearerToken

*Body*

```JSON5
    {
    }
```  

**Response**

```JSON5
    {
    }
```

---

### **4. GET - '/auth'**

**Request**

*Header*
	
	Authorization: BearerToken
	
*Body*

```JSON5
    {
    }
```  

**Response**

```JSON5
    {
        isAuth: Boolean,
    }
```

---

### **5. GET - '/profile/:username'**

**Request**

*Body*

```JSON5
    {
    }
```  

**Response**

```JSON5
    {
    	username: String,
        fullname: String,
        about: String,
        profileImage: String,
    }
```

---

### **6. GET - '/email'**

**Request**

*Header*
	
	Authorization: BearerToken

*Body*

```JSON5
    {
    }
```  

**Response**

```JSON5
    {
    	email: String,
    }
```

---

### **7. POST - '/profile'**

**Request**

*Header*
	
	Authorization: BearerToken

*Body*

```JSON5
    {
        fullname: String,
        about: String,
        profileImage: String,
    }
```  

**Response**

```JSON5
    {
        fullname: String,
        about: String,
        profileImage: String,
    }
```

---

### **8. POST - '/password'**

**Request**

*Header*
	
	Authorization: BearerToken

*Body*

```JSON5
    {
    	passowrd: String,
    	newPassword: String,
    }
```  

**Response**

```JSON5
    {
        token: String,
    }
```

---

### **9. GET - '/forget'**

**Request**

*Body*

```JSON5
    {
    }
```  

**Response**

```JSON5
    {
    }
```

---

## *Admin*

### Base Route For Admin - '/admin'

### **1. POST - '/signin'**

**Request**

*Body*

```JSON5
    {
    	email: String,                        
       	password: String,
    }
```  

**Response**

```JSON5
    {
        fullname: String,
        email: String,
    	token: String,
    }
```

---

### **2. GET - '/signout'**

**Request**

*Header*
	
	Authorization: BearerToken

*Body*

```JSON5
    {
    }
```  

**Response**

```JSON5
    {
    }
```

---

### **3. GET - '/auth'**

**Request**

*Header*
	
	Authorization: BearerToken

*Body*

```JSON5
    {
    }
```  

**Response**

```JSON5
    {
        isAuth: Boolean,
    }
```

---

### **4. Get - '/profile'**

**Request**

*Header*
	
	Authorization: BearerToken

*Body*

```JSON5
    {
    }
```  

**Response**

```JSON5
    {
        fullname: String,
        email: String,
    }
```

---

### **5. POST - '/password'**

**Request**

*Header*
	
	Authorization: BearerToken

*Body*

```JSON5
    {
    	passowrd: String,
    	newPassword: String,
    }
```  

**Response**

```JSON5
    {
        token: String,
    }
```

---

### **6. GET - '/forget'**

**Request**

*Body*

```JSON5
    {
    }
```  

**Response**

```JSON5
    {
    }
```

---