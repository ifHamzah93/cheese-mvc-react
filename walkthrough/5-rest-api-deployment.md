# Cheese REST API Deployment

The first step is to create our VPC. This is the "containment" area where we encapsulate the services we need for the deployment:

- ELB: elastic load balancer
    - public internet entry point
    - relays traffic to our API instance
        - would distribute traffic across multiple instances if we desired 
- EC2: elastic computer cloud instance
    - a VM running our API
- RDS: relational database service
    - our MySQL instance backing the API
- private subnets
    - inter-VPC communication between our API and RDS
    - encapsulates our RDS so that it is not accessible publicly
- public subnets
    - for exposing our API instance to the outer web through the ELB

Throughout the guide you will see [NOTE] next to certain steps. This means you should save this information because it is used further on in the guide. Keep a notepad open to keep this information handy.

# Setup
Before continuing setup the `application.properties` in your Cheese API project
- open IntelliJ to your project
- MAKE SURE you are on the `adding-rest` branch NOT `master` branch
- go to `src/main/resources/application.properties`
- replace it with the content below to use environment variables

```sh
# In Memory Database settings, uncomment if you don't have db setup
#spring.datasource.driver-class-name=org.h2.Driver
#spring.datasource.url=jdbc:h2:mem:test
#spring.jpa.properties.hibernate.dialect = org.hibernate.dialect.H2Dialect
#spring.jpa.hibernate.ddl-auto=update


# MYSQL Database connection settings
spring.datasource.url=jdbc:mysql://${DB_HOST}:${DB_PORT}/${DB_NAME}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.jpa.database = MYSQL
spring.jpa.show-sql = false
spring.jpa.hibernate.ddl-auto = update
spring.jpa.properties.hibernate.dialect = org.hibernate.dialect.MySQL5Dialect
```

# Create VPC
- services > VPC
- click [start VPC wizard] button
- step 1
    - VPC with a Single Public Subnet
- step 2 (leave defaults unless listed below)
    - VPC name: `<your-name>-API-VPC`
    - availability zone: `us-east-1a`
        - the first option if in another AZ
        - [NOTE] your chosen AZ
            - ex: `vpc: us-east-1a` 
    - subnet name: `<your-name>-public-subnet-1`
- create VPC > click [ok] button
    - [NOTE] your VPC ID `vpc-0cc9365241b38408e`

# Create RDS
First we will create the RDS subnet group

## Create RDS Private Subnet
- services > VPC
- sidebar -> subnets
- click [create subnet] button
- create subnet
    - name tag: `<your-name>-api-rds-subnet-1`
        - MAKE SURE you have the `-1` at the end
    - VPC: your VPC
    - availability zone [AZ]: `us-east-1a`
        - [NOTE] your chosen AZ
            - ex: `rds-subnet-1-AZ: us-east-1a` 
    - IPv4 CIDR block: `10.0.1.0/24`
        - MAKE SURE you use `1` here 
    - create
        - [NOTE] your subnet ID  
            - `rds-subnet-1-ID: subnet-0ba85cf0e4473980d` 
- click [create subnet] button (for the backup subnet)
    - name tag: `<your-name>-api-rds-subnet-2` 
        - MAKE SURE you have the `-2` at the end
    - VPC: your VPC
    - availability zone [AZ]: `us-east-1b`
        - MUST BE different from the AZ of the first subnet 
        - [NOTE] your chosen AZ
            - ex: `rds-subnet-2-AZ: us-east-1b` 
    - IPv4 CIDR block: `10.0.2.0/24`
        - MAKE SURE you use `2` here 
    - create
        - [NOTE] your subnet ID 
            - ex: `rds-subnet-2-ID: subnet-04d07141482159bc2` 
    
## Create RDS Subnet Group
- services > RDS
- sidebar -> subnet groups
- click [create db subnet group] button
- subnet group details
    - name: `<your-name>-api-db-subnet-group`
    - description: `API deployment private DB subnet group`
    - VPC: select your VPC
- add subnets
    - click [add all the subnets related to this VPC]
    - remove the last subnet
        - the one with a CIDR block of `10.0.0.0/24`
        - this may not be the last in the list, check the CIDR block
        - click [remove] button
    - from your [NOTEs] check that the 2 subnets that remain match your subnet IDs
- click [create] button   

## Create RDS Instance
you may have a view that is split into 3 sections or one giant section. it's the same information just split into 3 sections.

- services > RDS
- click [create database] button
- create database view (all defaults unless listed below)
    - engine options: `MySQL`
    - version: `MySQL 5.7.22` (anything `5.x.xx` is fine)
    - templates: `free tier`
- settings
    - db instance identifier: `<your-name>-api-rds`
    - expand credentials settings
        - master username: `cheese`
        - uncheck auto generate password
        - master password: `cheese-api`
- connectivity (might be named Network & Security)
    - VPC: choose your VPC 
    - expand additional connectivity configuration
        - subnet group: select your subnet group
        - VPC security group
            - select create new
            - group name: `<your-name>-api-db-security-group` 
            - AZ: `no preference`
- expand additional configuration
    - initial db name: `cheese_api`
    - uncheck enable automatic backups
- click [create database] button
- wait for the instance to get set up
    - open a new tab from services > EC2
    - leave this tab open you will return to it when the DB is set up
    - continue to `Create EC2` section below

# Create EC2

## Create S3 Bucket
You may already have a bucket check:

- terminal: `aws s3 ls`
    - look for your bucket name 
    - [NOTE] your bucket name
    - skip the next section
- if you don't have a bucket complete the next section

### Create a Bucket
- **note: the name must be unique across the entire world**
- terminal: `aws s3 mb s3://<unique-bucket-name>`
	- expected output: `make_bucket: your-bucket-name`
- terminal: `aws s3 ls`
	- expected output: your new bucket name (and maybe others)

## Upload `.jar` file
- if you haven't already create the `.jar` file
    - navigate to the API project directory
    - MAKE SURE you are on the `adding-rest` branch NOT `master` 
        - if not then enter `git checkout adding-rest` 
    - run `gradle bootRepackage` 
- use the AWS tool to upload the file to your new bucket
- terminal (in your API directory): `aws s3 cp build/libs/cheese-mvc-0.0.1-SNAPSHOT.jar s3://<your-bucket-name>/cheese-api/app.jar`
	- expected output: `build/libs/cheese-mvc-0.0.1-SNAPSHOT.jar to s3://<your-bucket-name>/cheese-api/app.jar`

## Create S3 IAM Policy & Role
You may already have this role in place check:

- service > IAM
- sidebar -> roles
    - look for `<your-name>-EC2-S3-readonly` role
    - if you have it skip the next 2 sections
- if you didn't have the role go to the next 2 sections to create it

### Create Policy
- services > IAM
- sidebar -> policies
- [Create Policy]: create a new policy for accessing your bucket
	- only allows EC2 instances `read` permission on your specific S3 bucket
- click the [JSON] tab
- edit and paste the JSON below
	- replace your bucket name under `Resource` field
- click [review policy] button
	- policy name: `<your-name>-bucket-readonly`

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::<your-bucket-name>/*"
        }
    ]
}
``` 

### Create Role

- AWS Services > IAM
- sidebar -> roles
- [Create Role]: create a role that uses the new policy
	- AWS Service -> EC2
		- allow our EC2 service to connect to the bucket
	- filter: `customer managed` 
	- add: `<your-name>-bucket-readonly`
- tags
    - key: `name`
    - value: `<your-name>-EC2-S3-readonly` 
- review
	- role name: `<your-name>-EC2-S3-readonly` 
	- role description: `Allows EC2 instances to read <your name> S3 bucket`

## Create EC2 Instance
- services > EC2
- click [launch instance] button
- step 1: select AMI
    - search for ubuntu
    - select `16.x` or `18.x` `LTS (HVM), SSD Volume`
        - changes depending on your AZ
- step 2: choose instance type
    - defaults (free tier)
- step 3: configure instance details (defaults unless listed below)
    - network: choose your VPC
    - subnet: choose `<your-name>-public-1`  
    - auto-assign public ip: `enable`
    - IAM role
        - select `<your-name>-S3-EC2-readonly` 
    - expand advanced details
- go back to the RDS tab you left open
- go to connectivity & security section
        - [NOTE] the endpoint of your RDS 
- scroll down to the security groups section
- click the security group with type `CIDR/IP-Inbound`
- opens a new tab
- new tab to modify security group  
    - select your security group
    - click the [Inbound] tab
    - click [edit] button
    - change the Source section
        - [Custom]
        - `10.0.0.0/16` (our VPC subnet CIDR block)
        - this lets our RDS only be accessible within our VPC 
- close tabs and go back to EC2 tab
- advanced details > user data
    - select [as text]
    - modify and paste the script below

user script - input your values replacing anything with `<YOUR-X>`
- `<YOUR-BUCKET-NAME>`
- `<YOUR-DB-ENDPOINT>`
- DO NOT
    - include the `<` or `>`
    - leave any spaces
- after editing paste it into the user script section

```sh
#!/bin/bash
# Install Java and MySQL client, -y flag means "answer yes to all prompts" 
apt-get update -y && apt-get install openjdk-8-jre-headless mysql-client awscli -y

# Create cheese-api user and working dirs, give ownership
useradd -M cheese-api
mkdir /opt/cheese-api
mkdir /etc/opt/cheese-api

# Download the app.jar file from your bucket
aws s3 cp s3://<YOUR-BUCKET-NAME>/cheese-api/app.jar /opt/cheese-api/app.jar

chown -R cheese-api:cheese-api /opt/cheese-api /etc/opt/cheese-api
chmod 777 /opt/cheese-api

# Write cheese-api config file
cat << EOF > /etc/opt/cheese-api/cheese-api.config
DB_HOST=<YOUR-DB-ENDPOINT>
DB_PORT=3306
DB_NAME=cheese_api
DB_USERNAME=cheese_api
DB_PASSWORD=cheese_api
EOF

# Write systemd unit file
cat << EOF > /etc/systemd/system/cheese-api.service
[Unit]
Description=Cheese REST API
After=syslog.target

[Service]
User=cheese-api
EnvironmentFile=/etc/opt/cheese-api/cheese-api.config
ExecStart=/usr/bin/java -jar /opt/cheese-api/app.jar SuccessExitStatus=143
Restart=no

[Install]
WantedBy=multi-user.target
EOF

# Enable and start the service
systemctl enable cheese-api.service
```

- step 4: add storage
    - defaults
- step 5: tags  
    - key: `name`
    - value: `<your-name>-cheese-api`
- step 6: configure security groups
    - create new security group
    - name: `<your-name>-cheese-api-ssh`
    - description: `SSH for <your-name> cheese API`
    - change source to `My IP`
- review and launch
    - choose your SSH key
    - launch

# Configure DB
As long as future API deployments use the same database credentials you only need to do this step once. 

- services > EC2
- sidebar -> instances
- select your instance
- [NOTE] your public IP address

## SSH Into Instance
- terminal: `ssh -i ~/.ssh/<your-key-name>.pem ubuntu@<your-public-IP>`
- [yes] add to hosts

## Setup Using `mysql`
- `mysql -h <your-db-endpoint> -u cheese -p` (password is `cheese-api`)
- in mysql shell
    - check for `cheese_api` database 
        - > `show databases;`
        - if you do not see `cheese_api` in the list
            - > `create database cheese_api`
    - create user account
        - > `create user 'cheese_api'@'%' identified by 'cheese_api';`  
    - grant privileges to user
        - > `grant all privileges on cheese_api.* to 'cheese_api'@'%';`
    - flush (reset) privileges
        - > `flush privileges;`
    - quit
        - > `\q`

# Create the ELB

## Create Public Subnet
Using an ELB requires two subnets across different availability zones
- services > VPC
- sidebar -> subnets
- click [create subnet] button
- create subnet (defaults unless listed below)
    - name tag: `<your-name>-public-subnet-2`
    - vpc: select your VPC
    - availability zone: `us-east-1b`
        - MUST BE a different AZ then your `-public-subnet-1` check your [NOTE]s
        - IPv4 CIDR block: `10.0.3.0/24`
- create subnet
- go to subnets
    - select your `-public-subnet-2` subnet
    - click [route table] tab
    - click the route table link
- route tables
    - click [routes] tab
    - click [edit routes]
    - click [add route]
    - destination: `0.0.0.0/0`
    - target: internet gateway -> select `igw-` option
    - click [save routes]

## Create ELB
- services > EC2
- sidebar -> load balancers
- click [create load balancer] button
- application load balancer http/https
- step 1: configure load balancer (defaults unless listed below)
    - name: `<your-name>-cheese-api-lb`
    - availability zones
        - vpc: select your VPC
        - check each AZ
            - select your `-public-subnet-#` in each AZ
    - tags
        - key: `name`
        - value: `<your-name>-cheese-api-lb`
- step 2: configure security settings
    - skip
- step 3: configure security groups 
    - create new security group
    - name: `<your-name>-api-public-lb`
    - description: `<your name> API load balancer` 
- step 4: configure routing
    - name: `<your-name>-api`
    - port: `8080`
- step 5: register targets
    - select your app below
    - click [add to registered]
    - review and create
- sidebar -> load balancers
- select your load balancer
- [NOTE] the DNS name

continue to [Cheese SPA Deployment](./cheese-spa-deployment.md)

    

 

    
 
 

    