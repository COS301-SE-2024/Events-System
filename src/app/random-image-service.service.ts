import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RandomImageServiceService {

  getRandomImageSource(): string {
    const imageSources = [
      "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?q=80&w=700&h=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", //cafe busy
      "https://images.unsplash.com/photo-1561221820-5ed0595bcb4c?q=80&w=700&h=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", //cafe dark
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=700&h=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", //mug plant
      "https://images.unsplash.com/photo-1606836591695-4d58a73eba1e?q=80&w=700&h=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",  //white meeting
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=700&h=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",  //White hands
      "https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=700&h=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",  //conference lap notebook
      "https://images.unsplash.com/photo-1606770347238-77fcfd29906c?q=80&w=700&h=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",   //laptop mug
      "https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?q=80&w=700&h=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" ,  //dark hall 
      "https://images.unsplash.com/photo-1540553016722-983e48a2cd10?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&h=400&q=80", //coffee 2 outside
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&h=400&q=80", //coffee 3 laugh
      "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&h=400&q=80", //cabin
      "https://images.unsplash.com/photo-1682407186023-12c70a4a35e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400&q=80", //orange forest top down
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=700&h=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" //microphone
      // "https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.jpg",  //night city
      // "https://img.daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.jpg",   //purple landscape
      // "https://img.daisyui.com/images/stock/photo-1414694762283-acccc27bca85.jpg",  //green bottom landscape
      // "https://img.daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.jpg",  //ultrawide
      // "https://img.daisyui.com/images/stock/photo-1567653418876-5bb0e566e1c2.jpg", //pink back


      // Add more image URLs as needed
    ];
    const randomIndex = Math.floor(Math.random() * imageSources.length);
    return imageSources[randomIndex];
  }
}
