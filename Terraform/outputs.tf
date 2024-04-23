output "instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.control_panel.id
}
<<<<<<< Updated upstream

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
=======
output "instance_control_panel" {
  description = "Public IP address Datenbank (EC2)"
  value       = aws_instance.control_panel.public_ip
}
output "instance_ansible" {
  description = "Public IP address Client (EC2)"
  value       = aws_instance.ansible.public_ip
}
output "instance_ansible2" {
  description = "Public IP address Server (EC2)"
>>>>>>> Stashed changes
  value       = aws_instance.ansible2.public_ip
}