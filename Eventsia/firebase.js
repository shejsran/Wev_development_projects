// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-analytics.js";
import { getAuth, getRedirectResult, signInWithRedirect, GoogleAuthProvider,signInWithPopup,signInWithEmailAndPassword ,onAuthStateChanged, createUserWithEmailAndPassword ,updateProfile} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";
import { getFirestore, collection, query, where, addDoc, setDoc, doc, getDoc, getDocs, updateDoc, arrayRemove, arrayUnion, deleteDoc } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js";
import { getStorage, ref , uploadBytes ,getDownloadURL } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBLdDI-Dt94krmMlKra6x95t3mduJaQBVI",
  authDomain: "event-3ff27.firebaseapp.com",
  projectId: "event-3ff27",
  storageBucket: "event-3ff27.appspot.com",
  messagingSenderId: "518289219631",
  appId: "1:518289219631:web:50c7455060756c52c8a6da",
  measurementId: "G-CF5MPWTRTM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const firestore = getFirestore(app);
const provider = new GoogleAuthProvider(app);

//----------------- Different pages js functions ------------------------//
if(isloginpage) {
  //----------------- user login authentication ------------------------//
  document.getElementById("loginbtn").addEventListener('click',function() {
    const loginemail= document.getElementById('username').value;
    const password= document.getElementById('password').value;
    signInWithEmailAndPassword(auth,loginemail,password)
    .then((userCredential)=>{
      const user = userCredential.user;
      location.replace("homepage/");
    })
    .catch((error)=>{
      const errorCode = error.code;
      const errorMessage = error.errorMessage;
      alert("Invalid ID or Password");
    })
  });


  //----------------- user signup authentication ------------------------//
  const signupform= document.querySelector('.sign-up-form')
  signupform.addEventListener('submit',(e)=>{
    e.preventDefault()

    const naam = document.getElementById('naam').value;
    const email_signup = document.getElementById('email-signup').value;
    const phn = document.getElementById('phn').value;
    const pass_sgn = document.getElementById('pass-signup').value;
    const dob = document.getElementById('dob').value;
    if(naam=="" || email_signup=="" || phn=="" || pass_sgn=="" || !dob){
      alert("Enter All Fields");
    }
    else{ 
      createUserWithEmailAndPassword(auth,email_signup,pass_sgn)
        .then( (cred)=> {
          const userRef1 =  doc(db, "users", cred.user.uid);
          //----------------- Adding user profile to user database ------------------------//
          setDoc(userRef1, {
            name: naam,
            email: email_signup,
            phone: phn,
            dob: dob,
          })
            .then(() => {
              alert("User added");
            })
            .catch((err) => {
              alert(err.message);
            })
          signupform.reset();
        })
        .catch((err)=>{
          alert(err.message);
        })
    }
  })

  //------------------signup with google-------------------------------//
  const googleSignupIcons = document.querySelectorAll('#googleSignup');
  googleSignupIcons.forEach((icon) => {
    icon.addEventListener('click', (e) => {
      signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
        const user = result.user;
        const userid = user.uid;
        const userRef = doc(db, 'users', userid);
        
        getDoc(userRef)
          .then((doc) => {
            if(doc.exists()) {
              location.replace("homepage/");
            } else {
              // user is new, add user details to the firestore database
              const userData = {
                name: user.displayName,
                email: user.email,
                image: user.photoURL,
                dob: "",
                phone: "",
                description: "",
              };
              setDoc(userRef, userData)
                .then(() => {
                  // user details added, go to homepage
                  location.replace("homepage/");
                })
                .catch((err) => {
                  alert(err);
                });
            }
          })
          .catch((err) => {
            alert(err);
          });
      })
        
    });
  });
  
}
else if(ishomepage){
  
  //----------------- user id printing in homepage ------------------------//
  onAuthStateChanged(auth, (user) => {
    //----------------- session implementation ------------------------//
    if (user) {
      const eventdb = collection(db, 'events');
      getDocs(eventdb)
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
            //----------------- ongoing events details printing ------------------------//
            var date = Date.now();
            var start = doc.data().start; 
            var end = doc.data().end;
            if(date >= start && date <= end) {
              const main = document.querySelector("#events-ongoing");
              const card = document.createElement('div');
              card.classList = 'swiper-slide';
              const eventCard = `
              <div class="card">
                <div class="card_img">
                  <img src="${doc.data().photoURL}" alt="Card Image">
                </div>
                <div class="card-content">
                  <h1>${doc.data().name}</h1>
                  <p>${doc.data().description}</p>
                  <button type="button" id="ongoingEve" class="btn btn-primary">Details</button>
                </div>
              </div>
              `;
              card.innerHTML += eventCard;
              main.appendChild(card);
              const viewMoreButton = card.querySelector('#ongoingEve');
              viewMoreButton.addEventListener('click', () => {
                  localStorage.setItem("r",doc.id);
                  console.log(localStorage.getItem("r"));
                  if(auth.currentUser.uid != doc.data().host)
                    window.location.href = "../register/index.html";
                  else
                  window.location.href = "../eventPageHost/index.html";
              });
            }
              
            //----------------- upcoming events details printing ------------------------//
            else if(date < start) {
              let timestamp = doc.data().start;
              let date = new Date(timestamp);
              let year = date.getFullYear();
              let month = date.getMonth() + 1;
              let day = date.getDate();
              let hours = date.getHours();
              let minutes = date.getMinutes();
              let seconds = date.getSeconds();
              let var1= day+"/"+month+"/"+year;
              let var2= hours+":"+minutes+":"+seconds;
              const upcomingMain = document.querySelector("#d-1");
              const upcomingCard = document.createElement('div');
              upcomingCard.classList = 'row schedule-item';
              const eventupcomingCard = `
              <div class="col-md-2"><time>${var1}</time><time>${var2}</time></div>
              <div class="col-md-10">
                <div class="speaker">
                  <img src="${doc.data().photoURL}" alt="Brenden Legros" />
                </div>
                <h4>${doc.data().name} <br><span>${doc.data().tagline}</span></h4>
                <p>${doc.data().description}</p>
                <br />
                <button type="button" id="eveDetails" class="btn btn-primary">Details</button>
                </div>
                `;
                upcomingCard.innerHTML += eventupcomingCard;
                upcomingMain.appendChild(upcomingCard);
                const viewMoreButton = upcomingCard.querySelector('#eveDetails');
                viewMoreButton.addEventListener('click', () => {
                    localStorage.setItem("r",doc.id);
                    console.log(localStorage.getItem("r"));
                    if(auth.currentUser.uid != doc.data().host)
                      window.location.href = "../register/index.html";
                    else
                    window.location.href = "../eventPageHost/index.html";
                });
             }

             //----------------- past events details printing ------------------------//
             else {
              let timestamp = doc.data().start;
              let date = new Date(timestamp);
              let year = date.getFullYear();
              let month = date.getMonth() + 1;
              let day = date.getDate();
              let hours = date.getHours();
              let minutes = date.getMinutes();
              let seconds = date.getSeconds();
              let var1= day+"/"+month+"/"+year;
              let var2= hours+":"+minutes+":"+seconds;
              const upcomingMain = document.querySelector("#d-2");
              const upcomingCard = document.createElement('div');
              upcomingCard.classList = 'row schedule-item';
              const eventupcomingCard = `
              <div class="col-md-2"><time>${var1}</time><time>${var2}</time></div>
              <div class="col-md-10">
                <div class="speaker">
                  <img src="${doc.data().photoURL}" alt="Brenden Legros" />
                </div>
                <h4>${doc.data().name} <br><span>${doc.data().tagline}</span></h4>
                <p>${doc.data().description}</p>
                <br />
                <button type="button" id="eveDetails" class="btn btn-primary">Details</button>
                </div>
                `;
                upcomingCard.innerHTML += eventupcomingCard;
                upcomingMain.appendChild(upcomingCard);
                const viewMoreButton = upcomingCard.querySelector('#eveDetails');
                viewMoreButton.addEventListener('click', () => {
                    localStorage.setItem("r",doc.id);
                    console.log(localStorage.getItem("r"));
                    if(auth.currentUser.uid != doc.data().host)
                      window.location.href = "../register/index.html";
                    else
                    window.location.href = "../eventPageHost/index.html";
                });
             }
          })
        })
    }
    else{
      location.replace("../index.html");
    }

    document.querySelector('.feedback_web').addEventListener('submit', (e)=>{
      e.preventDefault()
      
      let n=document.getElementById("email_feed").value;
      let dc=document.getElementById("msg_feed").value;
      const feedbackWeb = collection(db, "feedback_web");
        addDoc(feedbackWeb, {
          email: n,
          feedback: dc,
        })
          .then(()=>{
            alert("feedback sent!!");
            window.location.href=".";
          })
    })

    const notifydb = collection(db, 'notification');
      getDocs(notifydb)
      .then((snapshot) => {
        let i=0;
        snapshot.docs.forEach((dok) => {
          if(dok.data().user==auth.currentUser.uid) {
            i++;
            const main = document.querySelector("#box");
            const card = document.createElement('div');
            card.classList = 'notifi-item';
            const eventRef = doc(db, 'events',dok.data().event);
            getDoc(eventRef)
            .then((docu) => {
              const content = `
              <img src="${docu.data().photoURL}" alt="img">
              <div class="text"  id="eveDetail">
                  <h4>${docu.data().name}</h4>
                  <p>There is an update</p>
              </div>
              `;
              card.innerHTML += content;
              main.appendChild(card);
              const viewMoreButton = card.querySelector('#eveDetail');
                viewMoreButton.addEventListener('click', () => {
                    localStorage.setItem("r",docu.id);
                    console.log(localStorage.getItem("r"));
                    const del = doc(db, "notification", dok.id);
                    deleteDoc(del)
                      .then(()=>{
                        console.log("deleted");
                        if(auth.currentUser.uid != docu.data().host)
                          window.location.href = "../register/index.html";
                        else
                          window.location.href = "../eventPageHost/index.html";
                      })
                      .catch((e)=>{
                        console.log(e);
                      })
                });
            })
          }
        })
        // document.getElementById('count').innerHTML=i;
        document.getElementById('cnt').innerHTML=i;
        document.getElementById('cnt1').innerHTML=i;
        if(i==0) {
          const main = document.querySelector("#box");
          const card = document.createElement('div');
          card.classList = 'notifi-item';
          const content = `
            NO NOTIFICATION
          `;
          card.innerHTML += content;
          main.appendChild(card);
          // const par=document.querySelector('#notify');
          // par.style.display='none';
        }
      })

  });

  //----------------- user logout authentication ------------------------//
  document.getElementById("logoutbtn").onclick = function(){
    auth.signOut();
    navigate("/");
  }

  ///////////////////// SEARCH BOX /////////////////////////////////
  // Get reference to search bar input and submit button
  const searchInput = document.getElementById('searchQueryInput');
  const searchButton = document.getElementById('searchQuerySubmit');

  const dropdown = document.createElement('div');
  dropdown.classList.add('searchResultsDropdown');
  searchInput.parentNode.appendChild(dropdown);

  searchButton.addEventListener('click', async () => {
    const queryText = searchInput.value;
    const q = query(collection(db, 'events'), where('name', '==', queryText));
    const snapshot = await getDocs(q);

    const matchingEvents = snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name
    }));
    dropdown.innerHTML = '';

    if (matchingEvents.length > 0) {
      // Create dropdown item for each matching event
      matchingEvents.forEach(event => {
        const item = document.createElement('div');
        item.textContent = event.name;
        item.addEventListener('click', () => {
          // Set search input value to selected event name
          searchInput.value = event.name;
          // Clear search results dropdown
          dropdown.innerHTML = '';
        });
        dropdown.appendChild(item);
      });

      // Show search results dropdown
      dropdown.style.display = 'block';
    } else {
      // Hide search results dropdown
      dropdown.style.display = 'none';
    }
  });

  // Add event listener for search input focus
  searchInput.addEventListener('focus', () => {
    // Hide search results dropdown
    dropdown.style.display = 'none';
  });

  // Add event listener for search input blur
  searchInput.addEventListener('blur', () => {
    // Hide search results dropdown after a brief delay to allow time for a click on a dropdown item to register
    setTimeout(() => {
      dropdown.style.display = 'none';
    }, 100);
  });


}
else if(isRegister) {
  let isAttending=0;
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const q=localStorage.getItem("r");
      let eventRef = doc(db, 'events', q);
      getDoc(eventRef)
        .then((documen) => {
          let w=documen.data();
          //----------------- Print event details ------------------------//
          document.getElementById("eventName").innerHTML = w.name;
          document.getElementById("tagline").innerHTML = w.tagline;
          document.getElementById("description").innerHTML = w.description;
          document.getElementById("type").innerHTML = w.type;
          document.getElementById("EveImg").src = w.photoURL;
          // document.getElementById("intro").style.backgroundImage = "url('" + w.photoURL + "')";
          document.getElementById("eventCardName").innerHTML = w.name;
          document.getElementById("CardTag").innerHTML = w.tagline;
          document.getElementById("CardType").innerHTML = w.type;
          document.getElementById('Entertheroom').href = w.link;
          let timestamp1 = w.start;
          let date1 = new Date(timestamp1);
          let year1 = date1.getFullYear();
          let month1 = date1.getMonth() + 1;
          let day1 = date1.getDate();
          let hours1 = date1.getHours();
          let minutes1 = date1.getMinutes();
          let seconds1 = date1.getSeconds();
          document.getElementById('Stime').innerHTML= day1+"/"+month1+"/"+year1+"  "+hours1+":"+minutes1+":"+seconds1;
          let timestamp2 = w.end;
          let date2 = new Date(timestamp2);
          let year2 = date2.getFullYear();
          let month2 = date2.getMonth() + 1;
          let day2 = date2.getDate();
          let hours2 = date2.getHours();
          let minutes2 = date2.getMinutes();
          let seconds2 = date2.getSeconds();
          document.getElementById('Etime').innerHTML= day2+"/"+month2+"/"+year2+"  "+hours2+":"+minutes2+":"+seconds2;

          var endTime= w.end;
          if(endTime - Date.parse(new Date())>0){
            document.querySelector(".countdown-container").style.display= "block";
            initializeClock("countdown", endTime,function(){
              document.querySelector(".countdown-container").style.display = "none";
            });
          }

          //----------------- Print the rules ------------------------//
          var myArray = w.rules;
          myArray.forEach(function(element) {
            // console.log(element);
            const ruleDiv = document.querySelector("#rule-list");
            let li = document.createElement("li");
            let a = document.createElement("a");
            a.appendChild(document.createTextNode(element))
            // let icon = document.createElement("i");
            // icon.classList.add("fa", "fa-light", "fa-bullhorn");
            li.appendChild(a);
            // li.appendChild(icon)
            ruleDiv.appendChild(li);
          });
          document.getElementById("subscribe").style.display = 'none';
          //----------------- Cancel and register for event ------------------------//
            var eventAttendeesRef=doc(db,'attendees',q);
            var userID=auth.currentUser.uid;
            getDoc(eventAttendeesRef)
            .then((dok) => {
              if(dok.data().attendee.includes(userID)) {
                if(endTime - Date.parse(new Date())>0){
                  document.getElementById("subscribe").style.display = 'none';
                }
                else {
                  document.getElementById("Entertheroom").style.display = 'block';
                  document.getElementById("subscribe").style.display = 'block';
                  document.querySelector("#feedbacksubmit").addEventListener('submit', (e)=> {
                    e.preventDefault()
                    const feedref=collection(db, "feedback");
                    const user_feedback=document.getElementById("feedback").value;
                    if(user_feedback!="") {
                      const userid=auth.currentUser.uid;
                      const userRef = doc(db, 'users',userid);
                      getDoc(userRef).then((doc) => {
                        const user_img=doc.data().image;
                        const user_name=doc.data().name;
                        addDoc(feedref, {
                          eventId: q,
                          img: user_img,
                          user: user_name,
                          feedback: user_feedback,
                        })
                      }).then(()=>{
                          alert("feedback sent");
                        })
                    }
                  });
                }
                document.getElementById('msg').style.display = 'block';
                document.getElementById('register').style.display = 'none';
                document.getElementById('btn1').style.display = 'none';
                document.getElementById('btn2').style.display = 'block';
                document.getElementById("canBTN").addEventListener('click', () => {
                    updateDoc(eventAttendeesRef, {
                      attendee: arrayRemove(userID)
                    })
                      .then(()=>{
                        console.log("Successfully cancelled");
                        location.reload();
                      })
                      .catch(()=> {
                        console.log("Cannot be cancelled");
                      })
                  })
              }
              else {
                document.getElementById('msg').style.display = 'none';
                document.getElementById('register').style.display = 'block';
                document.getElementById('btn1').style.display = 'block';
                document.getElementById('btn2').style.display = 'none';
                var user_email1;
                document.getElementById("regBTN").addEventListener('click', () => {
                  updateDoc(eventAttendeesRef, {
                    attendee: arrayUnion(userID)
                  })
                  .then(()=>{
                    console.log("Successfully registered");
                    const userid=auth.currentUser.uid;
                    const userRef = doc(db, 'users',userid);
                    getDoc(userRef).then((doke) => {
                      user_email1=doke.data().email;
                      var Body = "You have successfully registered for the event " + w.name;
                      Email.send({
                        SecureToken : "84cd10c4-79b3-4e2a-b7ab-1512b156f7c2",
                        To : user_email1,
                        From : "ritesh.kg.7549@gmail.com",
                        Subject : "Email from Eventia",
                        Body : Body
                      }).then(
                        (message) => {
                          if(alert("Registered successfully")){}
                          else   
                          window.location.reload(); 
                        }
                        );
                      });
                  })
                  .catch(()=> {
                    console.log("Cannot be registered");
                  })
                })
                document.getElementById('subscribe').style.display= 'none';
              }
              if(endTime - Date.parse(new Date())<=0){
                document.getElementById('msg').style.display = 'none';
                document.getElementById('register').style.display = 'none';
                document.getElementById('btn1').style.display = 'none';
                document.getElementById('btn2').style.display = 'none';
              }
            })
            .catch(()=> {
              console.log("cancelled3");
            })


        })
        .catch((err)=> {
          console.log(err);
          console.log("Cannot get event details");
        })
    }
    else{
      location.replace("../index.html");
    }
  });

}
else if(isUpdateEvent) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const q=localStorage.getItem("r");
      let eventRef = doc(db, 'events', q);
      getDoc(eventRef)
        .then((documen) => {
          let w=documen.data();
          //----------------- Print event details ------------------------//
          document.getElementById("naam").value = w.name;
          document.getElementById("joininglink").value = w.link;
          document.getElementById("tagline").value = w.tagline;
          // const x = w.start;
          // const y = w.end;
          // const sDateTime = x.toISOString().slice(0, 16);
          // const eDateTime = y.toISOString().slice(0, 16);
          // document.getElementById("startTime").value = w.sDateTime;
          // document.getElementById("endTime").value = w.eDateTime;
          document.getElementById("type").value = w.type;
          document.getElementById("description").value = w.description;
          // document.getElementById("EveImg").src = w.photoURL;
        })
    } 
    else{
      location.replace("../index.html");
    }
  });

  document.querySelector('.event-upload-form').addEventListener('submit', (e)=>{
    e.preventDefault()
    const q=localStorage.getItem("r");
    let n=document.getElementById("naam").value;
    let jl=document.getElementById("joininglink").value;
    let tl=document.getElementById("tagline").value;
    let tp=document.getElementById("type").value;
    let dc=document.getElementById("description").value;
    const userDocRef = doc(firestore, "events", q);
      updateDoc(userDocRef, {
        name: n,
        link: jl,
        tagline: tl,
        type: tp,
        description: dc,
      })
        .then(()=>{
          // fetch all attendees of this event and both of them to notifiaction
          const q=localStorage.getItem("r");
          let attendeeRef = doc(db, 'attendees', q);
          getDoc(attendeeRef)
            .then((x)=>{
              const arr=x.data().attendee;
              arr.forEach((element) => {
                // element means user id and q means event id
                const notificationRef = collection(db, "notification");
                addDoc(notificationRef, {
                  event: q,
                  user: element,
                })
                .then(()=> {
                  window.location.href = "../eventPageHost/index.html";
                })
              })
            })
        })
  })
}
else if(isprofile) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const userid = user.uid;
      const userRef = doc(db, 'users',userid);
      getDoc(userRef)
        .then((doc) => {
          if(doc.exists()){
            const data = doc.data();
            document.getElementById("name").innerHTML= data.name;
            document.getElementById("nameFront").innerHTML=data.name;
            document.getElementById("dob").innerHTML=data.dob;
            document.getElementById("email").innerHTML=data.email;
            document.getElementById("phone").innerHTML=data.phone;
            document.getElementById("description").innerHTML=data.description;
            document.getElementById("output").src = data.image;
          }
        })
        .catch((err) => {
          alert("select query error");
        });

        //----------------- Events details printing ------------------------//
        const eventdb = collection(db, 'events');
        getDocs(eventdb)
          .then((snapshot) => {
            snapshot.docs.forEach((dok) => {
              const x=dok.id;
              const attendeesRef = doc(db, 'attendees', x);
              getDoc(attendeesRef)
                .then((list)=> {
                  if(list.data().attendee !== undefined && list.data().attendee.includes(auth.currentUser.uid)) {
                    const parentDiv = document.querySelector("#attended");
                    const upcomingCard = document.createElement('div');
                    upcomingCard.classList = 'card2';
                    const content = `
                    <div class="join_class">
                    <div class="card_img">
                        <img src="${dok.data().photoURL}" alt="event-img">
                    </div>
                    <div class="top-text">
                        <div class="name">${dok.data().name}</div>
                    </div>
                    </div>
                    <div class="bottom-text">
                        <p>${dok.data().tagline}</p>
                        <div class="text">${dok.data().description}</div>
                        <div class="btn">
                            <a href="#">Read more</a>
                        </div>
                    </div>
                    `;
                    upcomingCard.innerHTML += content;
                    parentDiv.appendChild(upcomingCard);
                    //------------------------ Adding functionality to the button ------------------------//
                    const viewMoreButton = upcomingCard.querySelector('.btn');
                    viewMoreButton.addEventListener('click', () => {
                      localStorage.setItem("r",dok.id);
                      console.log(localStorage.getItem("r"));
                      if(auth.currentUser.uid != dok.data().host)
                        window.location.href = "../register/index.html";
                      else
                        window.location.href = "../eventPageHost/index.html";
                    });
                  }
                })
                if(dok.data().host == auth.currentUser.uid) {
                  const parentDiv = document.querySelector("#hosted");
                  const upcomingCard = document.createElement('div');
                  upcomingCard.classList = 'card2';
                  const content = `
                  <div class = "join_class2">
                    <div class="card_img">
                        <img src="${dok.data().photoURL}" alt="event-img">
                    </div>
                    <div class="top-text">
                        <div class="name">${dok.data().name}</div>
                    </div>
                  </div>
                    <div class="bottom-text">
                        <p>${dok.data().tagline}</p>
                        <div class="text">${dok.data().description}</div>
                        <div class="btn">
                            <a href="#">Read more</a>
                        </div>
                    </div>
                  `;
                  upcomingCard.innerHTML += content;
                  parentDiv.appendChild(upcomingCard);
                  //------------------------ Adding functionality to the button ------------------------//
                  const viewMoreButton = upcomingCard.querySelector('.btn');
                  viewMoreButton.addEventListener('click', () => {
                    localStorage.setItem("r",dok.id);
                    console.log(localStorage.getItem("r"));
                    window.location.href = "../eventPageHost/index.html";
                  });
                }
            })
          })
          .catch(()=> {
            console.log("Cannot fetch event details");
          })
    }
    else{
      location.replace("../index.html");
    }
  });

  document.getElementById("ProfileLogout").onclick = function() {
    auth.signOut();
    navigate("../index.html");
  }
  
  document.getElementById("done_b").addEventListener('click',()=>{
    const naam = document.getElementById('name').textContent;
    const phn = document.getElementById('phone').textContent;
    const dob = document.getElementById('dob').textContent;
    const desc = document.getElementById('description').textContent;
    if(naam=="" || phn=="" || dob==""){
      alert("Enter All Fields");
    }
    else{
      const userDocRef = doc(firestore, "users", auth.currentUser.uid);
      updateDoc(userDocRef, {
        name: naam,
        phone: phn,
        dob: dob,
        description: desc,
      })
        .then(()=> {
          // alert("Profile updated successfully");
        })
        .catch(()=> {
          alert("Profile can't be updated");
        })
    }
  })

  // const fileInput= document.getElementById("upload-button");
  // fileInput.addEventListener("change",(event)=>{
  //   const file = event.target.files[0];
  //   const storageRef = ref(storage,`pic/${auth.currentUser.uid}/profile-image`);
  //   const userDocRef = doc(firestore, "users", auth.currentUser.uid);
  //   uploadBytes(storageRef, file).then(() => {
  //     getDownloadURL(storageRef).then((url) => {
  //       updateDoc(userDocRef, {
  //         image: url
  //       }).then(() => {
  //         location.reload();
  //       }).catch((error) => {
  //         alert(error.message);
  //       });
  //     }).catch((error) => {
  //       alert(error.message);
  //     });
  //   }).catch((error) => {
  //     alert(error.message);
  //   });
  // });

    //----------------update image-----------------------------------------//
  
  const fileInput= document.getElementById("file");
  fileInput.addEventListener("change",(event)=>{
    const file = event.target.files[0];
    const storageRef = ref(storage,`pic/${auth.currentUser.uid}/profile-image`);
    const userDocRef = doc(firestore, "users", auth.currentUser.uid);
    uploadBytes(storageRef, file).then(() => {
      getDownloadURL(storageRef).then((url) => {
        updateDoc(userDocRef, {
          image: url
        }).then(() => {
          location.reload();
        }).catch((error) => {
          alert(error.message);
        });
      }).catch((error) => {
        alert(error.message);
      });
    }).catch((error) => {
      alert(error.message);
    });
  });
  
}
else if(isHost) {
  //----------------- user id finding in profile ------------------------//
  onAuthStateChanged(auth, (user) => {
    if (user) {
    } 
    else{
      location.replace("../index.html");
    }
  });
  
    //-------------------------  Rules  ----------------------------------//
    const ruleFieldsWrapper = document.getElementById("rule-fields-wrapper");
    const addRuleButton = ruleFieldsWrapper.querySelector("#add-rule-btn");
    const removeRuleButton = ruleFieldsWrapper.querySelector("#remove-rule-btn");
    const optionsWrapper = document.querySelector(".options-wrapper");
    
    optionsWrapper.addEventListener("change", function(event) {
      if (event.target.value === "yes") {
        ruleFieldsWrapper.style.display = "block";
        addRuleButton.style.display = "block";
        removeRuleButton.style.display = "block";
        ruleFieldsWrapper.appendChild(addRuleButton); // Append the button to the wrapper
        ruleFieldsWrapper.appendChild(removeRuleButton); // Append the button to the wrapper
      } else {
        ruleFieldsWrapper.style.display = "none";
        addRuleButton.style.display = "none";
        removeRuleButton.style.display = "none";
        document.body.appendChild(addRuleButton); // Move the button back to the body
      }
    });
    
    addRuleButton.addEventListener("click", function() {
      const ruleFields = document.querySelectorAll(".rule");
      const newRuleField = ruleFields[ruleFields.length - 1].cloneNode(true);
      const newRuleInput = newRuleField.querySelector("input");
      const newRuleId = parseInt(newRuleInput.id.match(/\d+/)[0], 10) + 1;
      newRuleInput.id = `rule${newRuleId}`;
      newRuleInput.value = "";
      // newRuleField.appendChild(removeRuleButton);
      ruleFieldsWrapper.insertBefore(newRuleField,addRuleButton);
      ruleFieldsWrapper.insertBefore(addRuleButton,removeRuleButton);
    });
    
    removeRuleButton.addEventListener("click", function() {
      const ruleFields = document.querySelectorAll(".rule");

      if(ruleFields.length > 1){
        const lastRuleField = ruleFields[ruleFields.length - 1];
        lastRuleField.parentNode.removeChild(lastRuleField);
      }
    });

    

  //-----------------adding event to database ------------------------//f
  const eventupform= document.querySelector('.event-upload-form')
  eventupform.addEventListener('submit',(e)=>{
    e.preventDefault();

    const naam = document.getElementById('naam').value;
    const host = auth.currentUser.uid;
    const tagline= document.getElementById('TagLine').value;
    const link = document.getElementById('joininglink').value;
    const description = document.getElementById('description').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const rulesInputs = document.querySelectorAll("input[name='rules[]']");
    const rules = [];
    for (let i = 0; i < rulesInputs.length; i++) {
      rules.push(rulesInputs[i].value);
    }
    if(naam=="" || description=="" || !startTime || !endTime || link=="" || tagline=="") {
      alert("Enter All Fields");
    }
    else{ 

      //----------------- Converting start,end date-time to timestamp ------------------------//
      const StartdatetimeValue = startTime;
      const Sdatetime = new Date(StartdatetimeValue);
      const Stimestamp = Sdatetime.getTime();

      const EtartdatetimeValue = endTime;
      const Edatetime = new Date(EtartdatetimeValue);
      const Etimestamp = Edatetime.getTime();
      //----------------- Adding event data to events database ------------------------//
      const eventDataRef = collection(db, "events");
      addDoc(eventDataRef, {
        name: naam,
        tagline: tagline,
        host: host,
        link: link,
        description: description,
        start: Stimestamp,
        end: Etimestamp,
        rules: rules
      })
      .then((eventRef) => {
          const eventId = eventRef.id;
          //----------------- Adding event image to events storage ------------------------//
          const storageRef1 = ref(storage,`pic/events/${eventId}/display-image`)
          const eventsDocRef = doc(firestore, "events", eventId);
          const attendeesCollectionRef = collection(db, "attendees"); // assuming you have initialized your Firestore database instance as `db`
          const attendeeDocRef = doc(attendeesCollectionRef, eventId);
          setDoc(attendeeDocRef, {
            attendee: arrayUnion(host)
          })
          .then(() => {
            console.log("Attendee added successfully");
          })
          .catch((error) => {
            console.error("Error adding attendee: ", error);
          });

          uploadBytes(storageRef1, eventImg)
            .then(() => {
              // console.log("File uploaded successfully!");
              getDownloadURL(storageRef1)
                .then((url) => {
                  // console.log("File download URL:", url);
                  updateDoc(eventsDocRef, {
                    photoURL: url
                  })
                    .then(() => {
                      // console.log("Event profile image updated successfully!");
                      alert("Event added");
                      // navigate("../homepage/");
                      location.replace(/homepage/);
                    })
                    .catch((error) => {
                      console.error("Error updating event image:", error);
                      alert(error.message);
                    });
                })
                .catch((error) => {
                  console.error("Error getting file download URL:", error);
                  alert(error.message);
                });
              })
              .catch((error) => {
                console.error("Error uploading file:", error);
                alert(error.message);
              });
            })
        .catch((err) => {
          alert(err.message);
        })
    }
  })


  // const form = document.getElementById("arehogaya");
  // form.addEventListener("click", function(event) {
  //   event.preventDefault(); // prevent the form from submitting
  
  //   const rulesInputs = document.querySelectorAll("input[name='rules[]']");
  //   const rules = [];
  
  //   for (let i = 0; i < rulesInputs.length; i++) {
  //     rules.push(rulesInputs[i].value);
  //   }
  
  //   console.log(rules);
  //   // You can now use the `rules` array to store the rules in the Firebase database
  // })

}
else if(PageForHost) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const q=localStorage.getItem("r");
      let eventRef = doc(db, 'events', q);
      getDoc(eventRef)
        .then((dok) => {
          document.getElementById("eventName").innerHTML = dok.data().name;
          document.getElementById("eventTitle").innerHTML = dok.data().tagline;
          document.getElementById("eventDesc").innerHTML = dok.data().description;
          
          let timestamp1 = dok.data().start;
          let date1 = new Date(timestamp1);
          let year1 = date1.getFullYear();
          let month1 = date1.getMonth() + 1;
          let day1 = date1.getDate();
          let hours1 = date1.getHours();
          let minutes1 = date1.getMinutes();
          let seconds1 = date1.getSeconds();
          document.getElementById("start").innerHTML = day1+"/"+month1+"/"+year1+"  "+hours1+":"+minutes1+":"+seconds1;
          let timestamp2 = dok.data().end;
          let date2 = new Date(timestamp2);
          let year2 = date2.getFullYear();
          let month2 = date2.getMonth() + 1;
          let day2 = date2.getDate();
          let hours2 = date2.getHours();
          let minutes2 = date2.getMinutes();
          let seconds2 = date2.getSeconds();
          document.getElementById("end").innerHTML = day2+"/"+month2+"/"+year2+"  "+hours2+":"+minutes2+":"+seconds2;

          let attendeeRef=doc(db, 'attendees', q);
          getDoc(attendeeRef)
            .then((list)=> {
              const arr=list.data().attendee;
              arr.forEach((element) => {
                const userRef=doc(db, 'users', element);
                getDoc(userRef).then((d)=>{
                  const parentDiv = document.querySelector("#list");
                    const upcomingCard = document.createElement('div');
                    upcomingCard.classList = 'row-schedule-item';
                    const content = `
                    <div class="col-md-10">
                      <div class="speaker">
                        <img src="${d.data().image}" alt="Profile img">
                      </div>
                      <h4>${d.data().name}</h4>
                      <hr>
                    </div>
                    `;
                    upcomingCard.innerHTML += content;
                    parentDiv.appendChild(upcomingCard);
                })
              })
            })
            .catch(()=>{
              alert("cannot get all attendees");
            })
        })
        .catch(()=>{
          alert("Cannot fetch event details");
        })

      let feedref=collection(db, "feedback");
      getDocs(feedref).then((snapshot)=>{
        snapshot.docs.forEach((feeds) => {
          if(feeds.data().eventId == q) {
              const main = document.querySelector("#feedlist");
              const card = document.createElement('div');
              card.classList = 'row-schedule-item';
              const feedCard = `
              <div class="col-md-10">
                <div class="speaker">
                  <img src="${feeds.data().img}" alt="Profile img">
                </div>
                <h4>${feeds.data().user}</h4>
                <p>${feeds.data().feedback}</p>
                <hr>
              </div>
              `;
              card.innerHTML += feedCard;
              main.appendChild(card);
          }
        })
      })
    } 
    else{
      location.replace("../index.html");
    }
  });
}