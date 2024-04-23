provider "aws" {
  region = "eu-central-1"
}

resource "aws_vpc" "example_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  tags = {
    Name = "my-vpc"
  }
}

resource "aws_subnet" "control-panel" {
  vpc_id                  = aws_vpc.example_vpc.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "eu-central-1a"
  map_public_ip_on_launch = true
  tags = {
    Name = "Control Panel Subnet"
  }
}

resource "aws_subnet" "ansible" {
  vpc_id                  = aws_vpc.example_vpc.id
  cidr_block              = "10.0.3.0/24"
  availability_zone       = "eu-central-1a"
  map_public_ip_on_launch = true
  tags = {
    Name = "Ansible Subnet"
  }
}

resource "aws_subnet" "ansible2" {
  vpc_id                  = aws_vpc.example_vpc.id
  cidr_block              = "10.0.4.0/24"
  availability_zone       = "eu-central-1a"
  map_public_ip_on_launch = true
  tags = {
    Name = "Ansible Subnet2"
  }
}

resource "aws_internet_gateway" "example_igw" {
  vpc_id = aws_vpc.example_vpc.id
}

resource "aws_route_table" "example_route_table" {
  vpc_id = aws_vpc.example_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.example_igw.id
  }
}

resource "aws_route_table_association" "example_association" {
  subnet_id      = aws_subnet.control-panel.id
  route_table_id = aws_route_table.example_route_table.id
}

resource "aws_security_group" "example_security_group" {
  name        = "allow-ssh-http-https"
  description = "Allow SSH, HTTP, and HTTPS inbound traffic"
  vpc_id      = aws_vpc.example_vpc.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress  {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks  = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "control_panel" {
  vpc_security_group_ids = [aws_security_group.example_security_group.id]
  ami                    = "ami-0f673487d7e5f89ca"
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.control-panel.id
  tags = {
    Name = "control-panel"
  }
  user_data = <<-EOF
    #!/bin/bash
    yum update -y
    yum install -y docker
    systemctl enable docker
    systemctl start docker
    docker run -d -p 80:80 bestione/shopwize:latest
  EOF
}

resource "aws_instance" "ansible" {
  vpc_security_group_ids = [aws_security_group.example_security_group.id]
  ami                    = "ami-0f673487d7e5f89ca"
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.ansible.id
  tags = {
    Name = "ansible"
  }
  user_data = <<-EOF
    #!/bin/bash
    yum update -y
    yum install -y docker
    systemctl enable docker
    systemctl start docker
    docker run -d -p 80:80 bestione/shopwize:latest
  EOF
}

resource "aws_instance" "ansible2" {
  vpc_security_group_ids = [aws_security_group.example_security_group.id]
  ami                    = "ami-0f673487d7e5f89ca"
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.ansible2.id
  tags = {
    Name = "ansible2"
  }
}
