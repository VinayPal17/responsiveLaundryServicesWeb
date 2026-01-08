(function () {
    
    document.addEventListener('DOMContentLoaded', function(){

      const menuToggle = document.getElementById('menuToggle');
      const mobileMenu = document.getElementById('mobileMenu');
      const menuIcon = document.getElementById('menuIcon');

      menuToggle.addEventListener('click', () => {
        const isOpen = !mobileMenu.classList.contains('hidden');
        
        if (isOpen) {
          mobileMenu.classList.add('hidden');
          menuIcon.classList.remove('fa-xmark');
          menuIcon.classList.add('fa-bars');
          menuToggle.setAttribute('aria-expanded', 'false');
        } else {
          //To show menu on click
          mobileMenu.classList.remove('hidden');
          menuIcon.classList.remove('fa-bars');
          menuIcon.classList.add('fa-xmark');
          menuToggle.setAttribute('aria-expanded', 'true');
        }
      });

      
      mobileMenu.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          mobileMenu.classList.add('hidden');
          menuIcon.classList.remove('fa-xmark');
          menuIcon.classList.add('fa-bars');
          menuToggle.setAttribute('aria-expanded', 'false');
        });
      });
    });
})();





let cartItems = [];
let totalAmount = 0;


function addItem(serviceId, name, price) {
    const index = cartItems.findIndex(item => item.id === serviceId);
    const button = document.querySelector(`button[data-id="${serviceId}"]`);

    if (index === -1) {
        
        cartItems.push({ id: serviceId, name, price });
        totalAmount += price;

        
        button.innerHTML = `<span class="btn-text hidden md:inline-block">Remove Item</span> <i class="fa-solid fa-circle-minus"></i>`;
        
        button.className ="add-button text-black font-semibold flex items-center justify-center gap-2 rounded-full md:rounded-[14px] p-3 md:pt-2 md:pb-2 md:pl-3 md:pr-3 bg-red-100 text-red-500";
    } 
    else {
        
        totalAmount -= cartItems[index].price;
        cartItems.splice(index, 1);

        
        button.innerHTML = `<span class="btn-text hidden md:inline-block">Add Item</span> <i class="fa-solid fa-circle-plus"></i>`;
        

        button.className ="add-button text-black font-semibold flex items-center justify-center gap-2 rounded-full md:rounded-[14px] p-3 md:pt-2 md:pb-2 md:pl-6 md:pr-6 bg-gray-300";
    }

    updateCartUI();
    updateBookNowButton();
}


function updateCartUI() {
    const tableBody = document.getElementById("addedItems");
    const totalElement = document.getElementById("totalAmount");
    const emptyMessageDiv = document.getElementById("emptyMessage");
    const scroll = document.getElementById("scrollableDiv");

    if (cartItems.length === 0) {
        tableBody.innerHTML ="";
        emptyMessageDiv.style.display = "grid";
        scroll.classList.remove("h-[190px]");
        scroll.classList.remove("overflow-y-auto");
        scroll.classList.add("h-0");
               
    } else {
        emptyMessageDiv.style.display = "none";
        tableBody.innerHTML = "";
        scroll.classList.remove("h-0");
        scroll.classList.add("overflow-y-auto");
        scroll.classList.add("h-[190px]");
        cartItems.forEach((item, index) => {
            tableBody.innerHTML += `
                <tr class="border-b border-gray-300">
                    <td class="font-medium text-left pt-2 pr-2 pb-2 pl-3">${index + 1}</td>
                    <td class="font-medium text-center pt-2 pr-2 pb-2 sm:pl-0 md:pl-1">${item.name}</td>
                    <td class="font-medium text-right pt-2 pr-6 pb-2 ">₹${item.price}</td>
                </tr>
            `;
        });
    }

    totalElement.textContent = "₹" + totalAmount;
}

  

function updateBookNowButton() {
    const btn = document.getElementById("book-btn");

    if (cartItems.length === 0) {
        btn.classList.remove("bg-blue-600", "cursor-pointer");
        btn.classList.add("bg-gray-400", "cursor-not-allowed");
    } else {
        btn.classList.remove("bg-gray-400", "cursor-not-allowed");
        btn.classList.add("bg-blue-600", "cursor-pointer");
    }
}



function showMessage(text, type = "success") {
    const msg = document.getElementById("infoMessage");

     msg.textContent = text;    

    
    msg.className = "text-center mt-1.5 font-semibold  opacity-0 transition-all duration-500";

    
    if (type === "success") {
        msg.classList.add("text-green-800");
    }

    if (type === "error") {
        msg.classList.add("text-red-800");
    }
    
    if (type === "warning") {
        msg.classList.add("text-yellow-800");
    }

    
    setTimeout(() => {
        msg.classList.remove("opacity-0");
        msg.classList.add("opacity-100");
    }, 10);

    
    setTimeout(() => {
        msg.classList.remove("opacity-100");
        msg.classList.add("opacity-0");
    }, 3000);
}


document.getElementById("book-btn").addEventListener("click", function (e) {
    e.preventDefault();

    const addBtn = document.getElementsByClassName("add-button");
    

    if (cartItems.length === 0) {
        
        showMessage("⚠️ Please add at least one item!", "error");
        return;
    }

    const fullName = document.getElementById("fullName").value;
    const email = document.getElementById("emailField").value;
    const phone = document.getElementById("phoneField").value;

    if (fullName.trim() === "" || email.trim() === "" || phone.trim() === "") {
        showMessage("⚠️ Please fill all fields!", "warning");
        return;
    }

    const servicesList = cartItems.map((item, i) => `${i + 1}. ${item.name} - ₹${item.price}`).join("\n");

    const params = {
        customer_name: fullName,
        customer_email: email,
        customer_phone: phone,
        service_details: servicesList,
        total_amount: totalAmount
    };

    
        emailjs.send("service_aoow97q", "template_nwrvf1g", params).then(() => {    

            showMessage("Booking successful! ✔", "success");
            
            
            cartItems = [];
            totalAmount = 0;

            document.getElementById("fullName").value = "";
            document.getElementById("emailField").value = "";
            document.getElementById("phoneField").value = "";

             document.querySelectorAll(".add-button").forEach(btn => {
                btn.innerHTML = `<span class="btn-text hidden md:inline-block">Add Item</span> <i class="fa-solid fa-circle-plus"></i>`;
                

                btn.className ="add-button text-black font-semibold flex items-center justify-center gap-2 rounded-full md:rounded-[14px] p-3 md:pt-2 md:pb-2 md:pl-6 md:pr-6 bg-gray-300";
            });

            updateCartUI();
            updateBookNowButton();
        })
        .catch(() => {
            showMessage("🚫 Email sending failed!", "error");
        });
});