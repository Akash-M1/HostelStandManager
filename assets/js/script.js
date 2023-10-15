document.addEventListener("DOMContentLoaded",async function () {
    const currentUser = document.getElementById("current-user");
    const reservationForm = document.getElementById("reservation-form");
    const reservationList = document.getElementById("reservation-list");
    const fromDatetimeField = document.getElementById("from-datetime");
    const toOnlyCheckbox = document.getElementById("to-only");

    await displayReservations();

    let currentReserver = await checkPastCurrent();
    if(currentReserver.length==1){
        currentReserver=currentReserver[0].name;
    }
    else{
        currentReserver="None";
    }
    
    // Display the current user
    currentUser.textContent = currentReserver;

    // Toggle "from" field based on the checkbox
    toOnlyCheckbox.addEventListener("change", function () {
        fromDatetimeField.disabled = toOnlyCheckbox.checked;
        if (toOnlyCheckbox.checked) {
            fromDatetimeField.value = "";
        }
    });

    // Add a new reservation
    reservationForm.addEventListener("submit",async function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const fromDatetime = fromDatetimeField.value;
        const toDatetime = document.getElementById("to-datetime").value;
        const isCurrentChecked = toOnlyCheckbox.checked;

        if (!name || (!toOnlyCheckbox.checked && !fromDatetime) || !toDatetime) {
            alert("Please fill out all fields.");
            return;
        }
        const isPastCheck=await checkPastCurrent()
        if(isPastCheck.length>0 && isCurrentChecked){
            alert("Stand is currently already been used, please reserve it for later");
            return;
        }
        else{
            const data = new Object();
            data.name=name;
            if(toOnlyCheckbox.checked){
                data.from=new Date();
            }
            else{
                data.from=new Date(fromDatetime);
            }
            data.to=new Date(toDatetime);
            data.expireAt=new Date(toDatetime);
            const diffTime = Math.abs(data.to - data.from);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if(new Date(data.from).getTime()>new Date(data.to).getTime()){
                alert("Invalid Range Please Check the dates again");
                return;
            }
            if(diffDays>2){
                alert("For Once you can only choose is 2days, Please reserve again for more time");
                return;
            }
            data.currentUser=isCurrentChecked;
            $.ajax({
                type: "Post",
                url: "/stand/create-user",
                data: data,
                success:function(response){
                    if(response.message){
                        alert(response.message);
                        return;
                    }
                    else{
                        if(response.currentUser){
                            currentUser.textContent = response.name;
                        }
                        displayReservations();
                        fromDatetimeField.disabled=false;
                        reservationForm.reset();
                    }
                },
                error:function(err){
                    console.log("error",err.responseText);
                }
            });
        }
    });

    async function checkPastCurrent(){
        let pastCurrent=false;
        await $.ajax({
            type: "Get",
            url: "/stand/get-current",
            success:function(response){
                pastCurrent = response;
            },
            error:function(err){
                console.log("error",err.responseText);
            }
        });
        return pastCurrent;
    }

    // Delete a reservation
    reservationList.addEventListener("click",async function (e) {
        if (e.target && e.target.matches("button.delete")) {
            const delId = e.target.getAttribute("data-id");
            await $.ajax({
                type: "Delete",
                url: "/stand/delete-user",
                data: {id:delId},
                success:function(response){
                    if(response.currentUser){
                        currentUser.textContent = "None";
                    }
                    displayReservations();
                },
                error:function(err){
                    console.log("error",err.responseText);
                }
            });
        }
    });

    // Display upcoming reservations
    async function displayReservations() {
        reservationList.innerHTML = "";
        let reservations="";
        await $.ajax({
            type: "Get",
            url: "/stand/get-users",
            success:function(response){
                reservations = response;
            },
            error:function(err){
                console.log("error",err.responseText);
            }
        });
        reservations.forEach((reservation, index) => {
            const li = document.createElement("li");
            li.textContent = `Reserved by ${reservation.name} from ${new Date(reservation.from).toLocaleString()} to ${new Date(reservation.to).toLocaleString()}`;
            li.style.padding="20px";
            const deleteButton = document.createElement("button");
            deleteButton.innerHTML = "&times;";
            deleteButton.className = "delete";
            deleteButton.setAttribute("data-id", reservation._id);
            deleteButton.style.width="30px";
            deleteButton.style.height="30px";
            deleteButton.style.borderRadius="50%";
            deleteButton.style.marginTop="10px";
            deleteButton.style.marginLeft="15px";
            li.appendChild(deleteButton);
            reservationList.appendChild(li);
        });
    }
});