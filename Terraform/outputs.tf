output "instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.control_panel.id
}

output "instance_control_panel" {
  description = "Public IP address Control Panel (EC2)"
  value       = aws_instance.control_panel.public_ip
}

output "instance_ansible" {
  description = "Public IP address Ansible (EC2)"
  value       = aws_instance.ansible.public_ip
}

output "instance_monitor" {
  description = "Public IP address monitor (EC2)"
  value       = aws_instance.ansible2.public_ip
}
output "instance_ansible_b" {
  description = "Public IP address of Ansible (EC2) in subnet eu-central-1b"
  value       = aws_instance.ansible_b.public_ip
}
output "instance_ansible_c" {
  description = "Public IP address of Ansible (EC2) in subnet eu-central-1c"
  value       = aws_instance.ansible_c.public_ip
}
output "load_balancer_dns_name" {
  value = aws_lb.example_lb.dns_name
}