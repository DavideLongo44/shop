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

output "instance_ansible2" {
  description = "Public IP address Ansible2 (EC2)"
  value       = aws_instance.ansible2.public_ip
}