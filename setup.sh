apt-get update -y
apt-get install -y zsh vim git sudo
useradd user -m -s /usr/bin/zsh
echo 'user ALL=(ALL:ALL) NOPASSWD: ALL' >> /etc/sudoers

cd /home/user
sudo -u user RUNZSH=no sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
sed -i 's/ZSH_THEME="robbyrussell"/ZSH_THEME="ys"/' .zshrc