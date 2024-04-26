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
resource "aws_subnet" "eu-central-1b" {
  vpc_id                  = aws_vpc.example_vpc.id
  cidr_block              = "10.0.3.0/24"
  availability_zone       = "eu-central-1b"
  map_public_ip_on_launch = true
  tags = {
    Name = "eu-central-1b Subnet"
  }
}
resource "aws_subnet" "eu-central-1c" {
  vpc_id                  = aws_vpc.example_vpc.id
  cidr_block              = "10.0.4.0/24"
  availability_zone       = "eu-central-1c"
  map_public_ip_on_launch = true
  tags = {
    Name = "eu-central-1c Subnet"
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
resource "aws_route_table_association" "example_association_b" {
  subnet_id      = aws_subnet.eu-central-1b.id
  route_table_id = aws_route_table.example_route_table.id
}
resource "aws_route_table_association" "example_association_c" {
  subnet_id      = aws_subnet.eu-central-1c.id
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
   ingress {
    from_port   = 9090
    to_port     = 9090
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  # Grafana access for 3000
  ingress {
    from_port   = 3000
    to_port     = 3000
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
    yum install -y ansible git 
    systemctl enable ansible
    systemctl start ansible
    git clone --depth=1 --branch=Ansible https://github.com/DavideLongo44/shop.git home/ec2-user/
  EOF
}

resource "aws_instance" "ansible" {
  vpc_security_group_ids = [aws_security_group.example_security_group.id]
  ami                    = "ami-0f673487d7e5f89ca"
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.control-panel.id
  tags = {
    Name = "ansible"
  }
 lifecycle {
  prevent_destroy = true
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
resource "aws_instance" "ansible_b" {
  vpc_security_group_ids = [aws_security_group.example_security_group.id]
  ami                    = "ami-0f673487d7e5f89ca"
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.eu-central-1b.id
  tags = {
    Name = "ansible-eu-central-1b"
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

resource "aws_instance" "ansible_c" {
  vpc_security_group_ids = [aws_security_group.example_security_group.id]
  ami                    = "ami-0f673487d7e5f89ca"
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.eu-central-1c.id
  tags = {
    Name = "ansible-eu-central-1c"
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
  subnet_id              = aws_subnet.control-panel.id
  tags = {
    Name = "monitor"
  }
  lifecycle {
   prevent_destroy = true
}
  user_data = <<-EOF
    #!/bin/bash
    yum update -y
    yum install -y docker
    systemctl enable docker
    systemctl start docker
    docker run -d -p 3000:3000 --name=grafana grafana/grafana:latest
    docker run -d -p 9090:9090 --name=prometheus prom/prometheus:latest
  EOF
}
resource "aws_lb" "example_lb" {
  name                = "shopwise-load-balancer"
  internal            = false
  load_balancer_type  = "application"
  subnets             = [aws_subnet.control-panel.id, aws_subnet.eu-central-1b.id, aws_subnet.eu-central-1c.id] 
  security_groups     = [aws_security_group.example_security_group.id]
  lifecycle {
    prevent_destroy = true
  }  
}
resource "aws_lb_target_group" "example_target_group" {
  name        = "example-target-group"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = aws_vpc.example_vpc.id
  target_type = "instance"

  health_check {
    path                = "/"
    port                = 80
    protocol            = "HTTP"
    timeout             = 5
    interval            = 10
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}
resource "aws_lb_listener" "example_listener" {
  load_balancer_arn = aws_lb.example_lb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.example_target_group.arn
  }
}
resource "aws_lb_target_group_attachment" "example_attachment_ansible" {
  target_group_arn = aws_lb_target_group.example_target_group.arn
  target_id = aws_instance.ansible.id
  port = 80
  
}
resource "aws_lb_target_group_attachment" "example_attachment_ansible_b" {
  target_group_arn = aws_lb_target_group.example_target_group.arn
  target_id = aws_instance.ansible_b.id
  port = 80
  
}
resource "aws_lb_target_group_attachment" "example_attachment_ansible_c" {
  target_group_arn = aws_lb_target_group.example_target_group.arn
  target_id = aws_instance.ansible_c.id
  port = 80
  
}