# CivicFlow Testing Guide

This directory contains **JUnit** (unit tests) and **JMeter** (performance tests) for the CivicFlow project.

## 📁 Test Structure

```
tests/
├── junit/                           # JUnit unit tests (in src/test/)
│   ├── controller/
│   │   └── AuthControllerTest.java   # Authentication controller tests
│   ├── service/
│   │   └── UserServiceTest.java      # User service tests
│   └── repository/
│       └── UserRepositoryTest.java   # User repository tests
└── jmeter/                          # JMeter performance tests
    └── CivicFlow-Performance-Test.jmx # Main performance test plan
```

---

## 🔧 JUnit Tests

### **Setup**

1. **Ensure test dependencies are in `pom.xml`**:
   ```xml
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-test</artifactId>
       <scope>test</scope>
   </dependency>
   ```

2. **Run tests from command line**:
   ```bash
   mvn test
   ```

3. **Run specific test class**:
   ```bash
   mvn test -Dtest=AuthControllerTest
   ```

### **Test Coverage**

- **AuthControllerTest**: Tests authentication endpoints (register, login)
- **UserServiceTest**: Tests user service layer methods
- **UserRepositoryTest**: Tests database operations

---

## 🚀 JMeter Performance Tests

### **Setup**

1. **Install Apache JMeter**:
   - Download from: https://jmeter.apache.org/download_jmeter.cgi
   - Extract and add to PATH

2. **Start your CivicFlow backend**:
   ```bash
   mvn spring-boot:run
   ```

### **Running Tests**

1. **GUI Mode (for development)**:
   ```bash
   jmeter -t tests/jmeter/CivicFlow-Performance-Test.jmx
   ```

2. **Command Line Mode (for CI/CD)**:
   ```bash
   jmeter -n -t tests/jmeter/CivicFlow-Performance-Test.jmx -l results.jtl
   ```

3. **Generate HTML Report**:
   ```bash
   jmeter -n -t tests/jmeter/CivicFlow-Performance-Test.jmx -l results.jtl -e -o report/
   ```

### **Test Scenarios**

- **User Registration**: 10 threads, 5 loops (50 requests)
- **User Login**: 20 threads, 10 loops (200 requests)
- **Admin Dashboard**: 5 threads, 20 loops (100 requests)

---

## 📊 Understanding Results

### **JUnit Test Results**
- **Green**: All tests passed
- **Red**: Some tests failed
- **Coverage**: Shows which parts of code are tested

### **JMeter Performance Results**
- **Response Time**: How long requests take
- **Throughput**: Requests per second
- **Error Rate**: Percentage of failed requests
- **Load**: How system handles concurrent users

---

## 🔧 Customizing Tests

### **JUnit**
- Add more test methods for new features
- Mock external dependencies
- Test edge cases and error scenarios

### **JMeter**
- Adjust thread counts for different load levels
- Add more endpoints to test
- Configure different test scenarios

---

## 🚨 Important Notes

1. **For JMeter Admin Tests**: Replace `YOUR_ADMIN_JWT_TOKEN_HERE` with a valid admin JWT token
2. **Database**: Tests use in-memory H2 database by default
3. **Test Data**: JUnit tests create their own test data
4. **Performance**: Run performance tests on production-like environment for accurate results

---

## 📈 Best Practices

- **Run JUnit tests** before every commit
- **Run performance tests** before releases
- **Monitor trends** in performance over time
- **Keep tests simple** and focused
- **Mock external services** in unit tests

---

## 🛠️ Troubleshooting

### **JUnit Issues**
- Check database connections
- Verify mock configurations
- Ensure Spring context loads correctly

### **JMeter Issues**
- Verify backend is running on localhost:8080
- Check JWT tokens are valid
- Ensure proper HTTP headers are set

---

**Happy Testing! 🎯**