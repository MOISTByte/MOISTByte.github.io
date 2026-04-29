import os, subprocess
aliases = {"dikha": "ls", "badlo": "cd", "saaf": "clear", "bahar": "exit", "kahan": "pwd"}
def run_command(cmd):
    parts = cmd.strip().split()
    if not parts:
        return
    if parts[0] in aliases:
        parts[0] = aliases[parts[0]]
    if parts[0] == "cd":
        try:
            os.chdir(parts[1] if len(parts) > 1 else os.path.expanduser("~"))
        except Exception as e:
            print("Error:", e)
        return
    if parts[0] == "exit":
        print("Shell band ho rahi hai... ")
        exit()
    try:
        subprocess.run(parts)
    except FileNotFoundError:
        print("Command samajh nahi aaya ")
help = """
folders aur files kon si hai janane ke liye [dikha] dabaye
folder badalne ke liye [badlo] dabaye
safai karne ke liye [saaf] dabaye 
bahar jaane ke liye [baahar] dabaye
aap abhi kaha hai jaanane ke liye [kahan] dabaye
madad ke liye [help] dabaye"""
def main():
    while True:
        try:
            cwd = os.getcwd()
            cmd = input(f"{cwd} > ")
            print("madad ke liye [help] dabaye")
            if cmd == "help":
                print(help)
            else:
                run_command(cmd)
        except KeyboardInterrupt:
            print("\nUse 'bahar' to exit.")
if __name__ == "__main__":
    main()