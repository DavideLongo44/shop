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
  vpc_id                  = aws_vpc.example_vpc
  cidr_block              =  "10.0.2.0/24"
  availability_zone       = "eu_central-1a"
  map_public_ip_on_launch =  true
  tags = {
    Name = "Control Panel Subnet"
  }   
}

resource "aws_subnet" "ansible" {
  vpc_id                   = aws_vpc.example_vpc
  count                    = 2
  cidr_block               = "10.0.3.0/24"
  availability_zone        = "eu_central-1a"
  map_public_ip_on_launch  = true
  tags = {
    Name = "Ansible Subnet"
  }  
}

resource "aws_subnet" "ansible2" {
  vpc_id                   = aws_vpc.example_vpc
  count                    = 2
  cidr_block               = "10.0.4.0/24"
  availability_zone        = "eu_central-1a"
  map_public_ip_on_launch  = true
  tags = {
    Name = "Ansible Subnet2"
  }  
}