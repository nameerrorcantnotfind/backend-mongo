# Câu hỏi bảo vệ đồ án - Backend E-commerce API

## Câu hỏi về kiến trúc và thiết kế hệ thống

1. **Tại sao bạn chọn mô hình MVC kết hợp với Service Layer cho dự án này? Điều này mang lại lợi ích gì so với việc chỉ sử dụng MVC thuần túy?**
   
   *Why did you choose the MVC pattern combined with Service Layer for this project? What advantages does this provide compared to using pure MVC?*

2. **Giải thích cách bạn tổ chức cấu trúc thư mục trong dự án. Bạn có cân nhắc các cách tổ chức khác không và tại sao bạn chọn cách này?**
   
   *Explain how you organized the folder structure in your project. Did you consider other organizational approaches and why did you choose this one?*

3. **Trong dự án của bạn, bạn đã xử lý vấn đề bảo mật như thế nào? Cụ thể là về xác thực, phân quyền và bảo vệ dữ liệu nhạy cảm?**
   
   *How did you handle security concerns in your project? Specifically regarding authentication, authorization, and protection of sensitive data?*

4. **Bạn đã áp dụng những design pattern nào trong dự án? Hãy lấy ví dụ cụ thể và giải thích tại sao bạn chọn pattern đó.**
   
   *What design patterns did you apply in your project? Please provide specific examples and explain why you chose those patterns.*

5. **Nếu cần mở rộng hệ thống để hỗ trợ hàng triệu người dùng, bạn sẽ thay đổi kiến trúc hiện tại như thế nào?**
   
   *If you needed to scale the system to support millions of users, how would you modify the current architecture?*

## Câu hỏi về công nghệ và triển khai

6. **Tại sao bạn chọn MongoDB thay vì một cơ sở dữ liệu quan hệ như MySQL? Trong trường hợp nào bạn sẽ cân nhắc chuyển sang cơ sở dữ liệu quan hệ?**
   
   *Why did you choose MongoDB instead of a relational database like MySQL? In what scenarios would you consider switching to a relational database?*

7. **JWT được sử dụng cho xác thực trong dự án của bạn. Hãy giải thích cơ chế hoạt động của JWT và những ưu, nhược điểm của nó so với các phương pháp xác thực khác.**
   
   *JWT is used for authentication in your project. Please explain how JWT works and its advantages and disadvantages compared to other authentication methods.*

8. **Bạn đã xử lý vấn đề refresh token như thế nào? Làm thế nào để đảm bảo người dùng không phải đăng nhập lại thường xuyên mà vẫn đảm bảo an toàn?**
   
   *How did you handle refresh tokens? How do you ensure users don't have to log in frequently while maintaining security?*

9. **Bạn đã triển khai error handling trong dự án như thế nào? Làm thế nào để đảm bảo API trả về thông báo lỗi nhất quán và hữu ích?**
   
   *How did you implement error handling in your project? How do you ensure the API returns consistent and helpful error messages?*

10. **Bạn đã thực hiện việc validation dữ liệu đầu vào như thế nào? Tại sao việc này quan trọng và bạn đã sử dụng những kỹ thuật nào?**
    
    *How did you implement input data validation? Why is this important and what techniques did you use?*

## Câu hỏi về tính năng và logic nghiệp vụ

11. **Giải thích quy trình xử lý đơn hàng từ khi người dùng đặt hàng đến khi đơn hàng được hoàn thành. Các trạng thái đơn hàng khác nhau có ý nghĩa gì?**
    
    *Explain the order processing flow from when a user places an order until the order is completed. What do the different order statuses mean?*

12. **Làm thế nào để hệ thống của bạn đảm bảo rằng khi người dùng đặt hàng, sản phẩm vẫn còn trong kho? Bạn xử lý trường hợp nhiều người cùng đặt hàng một sản phẩm có số lượng hạn chế như thế nào?**
    
    *How does your system ensure that when a user places an order, the product is still in stock? How do you handle cases where multiple users order a product with limited quantity?*

13. **Bạn đã triển khai chức năng thanh toán như thế nào? Hệ thống của bạn tương tác với các cổng thanh toán bên thứ ba ra sao?**
    
    *How did you implement the payment functionality? How does your system interact with third-party payment gateways?*

14. **Hệ thống phân quyền của bạn hiện tại chỉ có hai vai trò: User và Admin. Làm thế nào để mở rộng hệ thống này để hỗ trợ nhiều vai trò hơn với các quyền hạn chi tiết?**
    
    *Your current authorization system only has two roles: User and Admin. How would you extend this system to support more roles with granular permissions?*

15. **Giải thích cách bạn xử lý việc cập nhật giỏ hàng khi người dùng thêm sản phẩm. Làm thế nào để đảm bảo tính nhất quán của dữ liệu khi có nhiều thao tác cùng lúc?**
    
    *Explain how you handle cart updates when users add products. How do you ensure data consistency when there are multiple operations happening simultaneously?*

## Câu hỏi về kiểm thử và bảo trì

16. **Bạn đã áp dụng những phương pháp kiểm thử nào cho dự án? Hãy giải thích chiến lược kiểm thử của bạn và tại sao nó hiệu quả.**
    
    *What testing methodologies did you apply to the project? Please explain your testing strategy and why it's effective.*

17. **Làm thế nào để bạn đảm bảo API của mình hoạt động đúng khi có thay đổi code? Bạn có sử dụng CI/CD không và nó được cấu hình như thế nào?**
    
    *How do you ensure your API works correctly when code changes are made? Do you use CI/CD and how is it configured?*

18. **Bạn đã xử lý vấn đề logging và monitoring như thế nào? Làm thế nào để bạn phát hiện và giải quyết các vấn đề trong môi trường production?**
    
    *How did you handle logging and monitoring? How do you detect and resolve issues in the production environment?*

19. **Nếu cần thêm một tính năng mới vào hệ thống, bạn sẽ thực hiện quy trình phát triển như thế nào từ lúc lên ý tưởng đến khi triển khai?**
    
    *If you needed to add a new feature to the system, what development process would you follow from ideation to deployment?*

20. **Dự án của bạn có những hạn chế gì? Nếu có thêm thời gian, bạn sẽ cải thiện những phần nào và bằng cách nào?**
    
    *What are the limitations of your project? If you had more time, what aspects would you improve and how?*
