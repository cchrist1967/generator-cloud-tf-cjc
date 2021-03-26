'use strict';
const { snakeCase } = require('snake-case');
const options = {
  delimiter: "-"
};

var Generator = require('yeoman-generator');
const { exec } = require('child_process');
const os = require('os');
const chalk = require("chalk");
const yosay = require("yosay");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option('babel');
  }

  async prompting() {
    this.log(
      yosay(
        `Welcome to the ${chalk.red(
          "generator-cloud-tf-cjc"
        )} generator!`
      )
    );
    this.log(`${chalk.cyan("This generator creates project scaffolding for an AWS or Azure project to support one or more of the following environments:")}`);
    this.log(`${chalk.cyan("Upper Environments: prod (default) and/or uat")}`);
    this.log(`${chalk.cyan("Lower Environments: dev (default), sit and/or qa\n\n")}`);

    this.log(`Your Operating System: ${chalk.blue(os.platform(), os.type(), os.release())}`);

    // PROJECT QUESTIONS
    const project_questions = [
      {
        type: "input",
        name: "project",
        message: "The name of the project:",
        store: true
      },
      {
        type: "input",
        name: "stack",
        message: "The stack of resources that these templates will generate.",
        default: this.appname // Default to current folder name
      },
      {
        type: "input",
        name: "description",
        message: "Please provide a description of this project stack.",
        store: true
      },

    ]

    // ENVIRONMENT QUESTIONS
    const env_questions = [
      {
        type: 'checkbox',
        name: 'environments',
        message: 'Select all environments you want to support with these templates:',
        choices: [
          {
            name: 'dev',
            value: 'dev',
            checked: true
          }, {
            name: 'qa',
            value: 'qa'
          }, {
            name: 'sit',
            value: 'sit'
          }, {
            name: 'uat',
            value: 'uat'
          }, {
            name: 'prod',
            value: 'prod',
            checked: true
          }
        ],
        store: true
      }
    ]

    // CLOUD PROVIDER SELECTION
    const cloud_questions = [
      {
        type: 'list',
        name: 'cloud',
        message: 'Select target Cloud Provider:',
        choices: [
          {
            name: 'Azure',
            value: 'azurerm',
          }, {
            name: 'AWS',
            value: 'aws'
          }
        ]
      }
    ]

    const aws_questions = [
      {
        type: 'list',
        name: 'region',
        message: 'Select default AWS Region:',
        choices: [
          {
            name: 'US East 2 (Ohio)',
            value: 'us-east-2',
          }, {
            name: 'US East 1 (N. Virginia)',
            value: 'us-east-1'
          }, {
            name: 'US West 1 (N. California)',
            value: 'us-west-1'
          }, {
            name: 'US West 2 (Oregon)',
            value: 'us-west-2'
          }, {
            name: 'Canada (Central)',
            value: 'ca-central-1'
          }
        ],
        store: true
      }      
    ]

    const aws_upper_backend_questions = [
      {
        type: "input",
        name: "upper_backend_bucket_name",
        message: "Name of UPPER AWS Backend S3 Bucket (Upper backend-bucket-name output value)",
        store: true     
      }
    ]
    const aws_lower_backend_questions = [
       {
        type: "input",
        name: "lower_backend_bucket_name",
        message: "Name of LOWER AWS Backend S3 Bucket (Lower backend-bucket-name output value)",
        store: true     
      }
    ]

    const azurerm_questions = [
      {
        type: 'list',
        name: 'region',
        message: 'Select default Azure Region:',
        choices: [
          {
            name: 'Central US',
            value: 'Central US',
          }, {
            name: 'East US',
            value: 'East US'
          }, {
            name: 'East US 2',
            value: 'East US 2'
          }, {
            name: 'North Central US',
            value: 'North Central US'
          }, {
            name: 'South Central US',
            value: 'South Central US'
          }, {
            name: 'West Central US',
            value: 'West Central US'
          }, {
            name: 'WEST US',
            value: 'WEST US'
          }, {
            name: 'WEST US 2',
            value: 'WEST US 2'
          }
        ],
        store: true
      }
    ]

    const azurerm_upper_backend_questions = [
      {
        type: "input",
        name: "upper_backend_resource_group_name",
        message: "Name of UPPER Azure Backend Storage Resource Group (Upper backend-resource-group output value)",
        store: true     
      },
      {
        type: "input",
        name: "upper_backend_storage_account_name",
        message: "Name of UPPER Azure Backend Storage Account (Upper backend-storage-account output value)",
        store: true     
      },
      {
        type: "input",
        name: "upper_backend_container_name",
        message: "Name of UPPER Azure Backend Container (Upper backend-storage-container output value)",
        store: true     
      }
    ]
    const azurerm_lower_backend_questions = [
      {
        type: "input",
        name: "lower_backend_resource_group_name",
        message: "Name of LOWER Azure Backend Storage Resource Group (Lower backend-resource-group output value)",
        store: true     
      },
      {
        type: "input",
        name: "lower_backend_storage_account_name",
        message: "Name of LOWER Azure Backend Storage Account (Lower backend-storage-account output value)",
        store: true     
      },
      {
        type: "input",
        name: "lower_backend_container_name",
        message: "Name of LOWER Azure Backend Container (Lower backend-storage-container output value)",
        store: true     
      }
    ]

    // TOOLS/CONFIGURATION QUESTIONS
    const tool_questions = [
      {
        type: "confirm",
        name: "precommit",
        message: "Would you like to install/reinstall the pre-commit checks? (n will skip but not unistall)"
      },
      {
        type: "confirm",
        name: "gitflow",
        message: "Would you like to configure/reconfigure git flow as a branching strategy? (n will skip but not unconfigure)"
      },
      {
        type: "confirm",
        name: "atlantis",
        message: "Would you like Atlantis workflow configured/reconfigured for this project? (n will skip but not unconfigure)"
      }
    ]

    // TAGGING QUESTIONS
    const tag_questions = [
      {
        type: "input",
        name: "name",
        message: "Your first and last name:",
        store: true
      },
      {
        type: "input",
        name: "manager",
        message: "Your Manager's name:",
        store: true
      },
      {
        type: "input",
        name: "market",
        message: "Your market:",
        default: "Boston Build",
        store: true
      },
      {
        type: "input",
        name: "client",
        message: "Name of client/customer:",
        store: true
      },
      {
        type: "input",
        name: "owner",
        message: "Who owns the resources created by this stack?",
        store: true
      }
    ]

    // ASK PROJECT QUESTIONS
    this.log(`${chalk.cyan("\nPROJECT INFO:")}`)
    this.project_answers = await this.prompt(project_questions);

    // ASK CLOUD QUESTIONS
    this.log(`${chalk.cyan("\nCLOUD PROVIDER & REGION")}`)
    this.cloud_answers = await this.prompt(cloud_questions);
    switch (this.cloud_answers.cloud) {
      case 'azurerm':
        this.cloud_answers2 = await this.prompt(azurerm_questions);
        break;
      case 'aws':
        this.cloud_answers2 = await this.prompt(aws_questions);
        break;
    }

    // ASK ENVIRONMENT QUESTIONS
    this.log(`${chalk.cyan("\nSUPPORTED ENVIRONMENTS:")}`)
    this.env_answers = await this.prompt(env_questions);

    this.backend_env = [];
    this.lower_envs = ['dev', 'qa', 'sit']
    this.upper_envs = ['uat', 'prod']
    var env;
    for (env of this.env_answers.environments) {
      if (this.lower_envs.includes(env)) {
        this.backend_env.push("lower");
        break
      };
    }
    for (env of this.env_answers.environments) {
      if (this.upper_envs.includes(env)) {
        this.backend_env.push("upper");
        break
      };
    }
    this.log("Backend ENVs: " + this.backend_env);

    // ASK BACKEND QUESTIONS
    this.log(`${chalk.cyan("\nTERRAFORM BACKENDs")}`)
    this.log(`${chalk.yellow("If the cloud-tf-backend-cjc generator was used to create the backend, refer to the outputs of those templates for the following values")}`)
    this.log(`${chalk.yellow("Otherwise, if you don't know or don't have your backend setup yet, just hit enter to leave the values blank for now.")}`)
    this.log(`${chalk.yellow("You can re-run this generator in this directory once you have your backend setup.")}`)
    if (this.backend_env.includes("lower")) {
      this.log(`${chalk.cyan("\nLOWER ENVIRONMENT BACKEND: (e.g. "+this.lower_envs+")")}`)
      switch (this.cloud_answers.cloud) {
        case 'azurerm':
          this.lower_backend_answers = await this.prompt(azurerm_lower_backend_questions);
          break;
        case 'aws':
          this.lower_backend_answers = await this.prompt(aws_lower_backend_questions);
          break;
      }
    }
    if (this.backend_env.includes("upper")) {
      this.log(`${chalk.cyan("\nUPPER ENVIRONMENT BACKEND: (e.g. "+this.upper_envs+")")}`)
       switch (this.cloud_answers.cloud) {
        case 'azurerm':
          this.upper_backend_answers = await this.prompt(azurerm_upper_backend_questions);
          break;
        case 'aws':
          this.upper_backend_answers = await this.prompt(aws_upper_backend_questions);
          break;
      }
    }


    // ASK TOOLING QUESTIONS
    this.log(`${chalk.cyan("\nTOOL INSTALLATION/CONFIGURATION:")}`)
    this.tool_answers = await this.prompt(tool_questions);

    // ASK TAGGING QUESTIONS
    this.log(`${chalk.cyan("\nTAGS:")}`)
    this.tag_answers = await this.prompt(tag_questions);

  }

  writing() {

    // CLOUD PROVIDER CONFIGURATION
    var tf_backend;
    var cloud_provider_version;
    var backend_template;
    var main_template;
    if (this.cloud_answers.cloud === "azurerm") {
      backend_template = "backends/azurerm-backend",
      cloud_provider_version = "2.50",
      tf_backend =  "azurerm",
      main_template = "azurerm-main.tf"
    }
    if (this.cloud_answers.cloud === "aws") {
      backend_template = "backends/aws-backend",
      cloud_provider_version = "3.0",
      tf_backend =  "s3",
      main_template = "aws-main.tf"
    }

    // TERRAFORM TEMPLATES
    this.fs.copyTpl(
      this.templatePath(main_template),
      this.destinationPath('main.tf'),
      {
        cloud_provider: this.cloud_answers.cloud,
        cloud_provider_version: unescape(cloud_provider_version),
        tf_backend: tf_backend,
        region: this.cloud_answers2.region
      }
    );

    this.fs.copy(
      this.templatePath('outputs.tf'),
      this.destinationPath('outputs.tf')
    );

    this.fs.copyTpl(
      this.templatePath('variables.tf'),
      this.destinationPath('variables.tf'),
      {
        project: this.project_answers.project,
        name:    this.tag_answers.name,
        manager: this.tag_answers.manager,
        market:  this.tag_answers.market,
        owner:   this.tag_answers.owner,
        client:  this.tag_answers.client
      }
    );

    // ATLANTIS PROJECT & WORKFLOW CONFIGURATION
    if (this.tool_answers.atlantis) {
      this.fs.copyTpl(
        this.templatePath('atlantis.yaml'),
        this.destinationPath('atlantis.yaml'),
        {
          stack: snakeCase(this.project_answers.stack, options)
        }
      );
      this.fs.copy(
        this.templatePath('scripts'),
        this.destinationPath('scripts')
      );
    };

    // REPO CONFIG
    this.fs.copy(
      this.templatePath('.gitignore.tpl'),
      this.destinationPath('.gitignore')
    );

    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
      { overview: this.project_answers.description }
    );

    if (this.tool_answers.precommit) {
      this.fs.copy(
        this.templatePath('.pre-commit-config.yaml'),
        this.destinationPath('.pre-commit-config.yaml')
      )
    };

    for (var env of this.env_answers.environments) {
      // TERRAFORM PARAMETERS
      this.fs.copyTpl(
        this.templatePath('parameters/env.tfvars'),
        this.destinationPath('parameters/<%= env %>.tfvars'),
        { 
          env: env,
          region: this.cloud_answers2.region
        }
      );
      this.fs.copyTpl(
        this.templatePath('parameters/env-stack.tfvars'),
        this.destinationPath('parameters/<%= env %>-<%= stack %>.tfvars'),
        { 
          env: env,
          stack: snakeCase(this.project_answers.stack, options)
        }
      );

      this.fs.copyTpl(
        this.templatePath('backends/env-stack-backend-key'),
        this.destinationPath('backends/<%= env %>-<%= stack %>-backend-key'),
        { 
          env: env,
          stack: snakeCase(this.project_answers.stack, options)
        }
      );

      // TERRAFORM BACKENDS
      for (let i = 0; i < this.backend_env.length; i++) {
        var backend_bucket_name = " ";
        var backend_resource_group_name = " ";
        var backend_storage_account_name = " ";
        var backend_container_name = " ";
        if (this.lower_envs.includes(env)) {
          if (this.cloud_answers.cloud === "aws") {
            backend_bucket_name = this.lower_backend_answers.lower_backend_bucket_name;
          }
          if (this.cloud_answers.cloud === "azurerm") {
            backend_resource_group_name = this.lower_backend_answers.lower_backend_resource_group_name;
            backend_storage_account_name = this.lower_backend_answers.lower_backend_storage_account_name;
            backend_container_name = this.lower_backend_answers.lower_backend_container_name;
          }
        }
        if (this.upper_envs.includes(env)) {
          if (this.cloud_answers.cloud === "aws") {
            backend_bucket_name = this.upper_backend_answers.upper_backend_bucket_name
          }
          if (this.cloud_answers.cloud === "azurerm") {
            backend_resource_group_name = this.upper_backend_answers.upper_backend_resource_group_name;
            backend_storage_account_name = this.upper_backend_answers.upper_backend_storage_account_name;
            backend_container_name = this.upper_backend_answers.upper_backend_container_name;
          }
        }
        this.fs.copyTpl(
          this.templatePath(backend_template),
          this.destinationPath('backends/<%= env %>-backend'),
          { 
            env: env,
            backend_bucket_name: backend_bucket_name,
            backend_resource_group_name: backend_resource_group_name,
            backend_storage_account_name: backend_storage_account_name,
            backend_container_name: backend_container_name,
            backend_region: this.cloud_answers2.region
          }
        )
      }

    }
  }

  install() {
    if (this.tool_answers.gitflow) {
      this.log("\n\n")
      this.log(`${chalk.cyan("INSTALLING GIT FLOW")}`)
      if (os.platform() === "linux" ) { 
        this.log("*** Installing with apt-get ***")
        this.spawnCommandSync("sudo", ["apt-get", "update"])
        this.spawnCommandSync("sudo", ["apt-get", "install", "git-flow"])
      }
      this.log(`${chalk.cyan("\nINITIALIZING GIT REPO with GIT FLOW")}`)
      this.spawnCommandSync("git", ["flow", "init"])
    } else {
      this.log(`${chalk.cyan("\nINITIALIZING GIT REPO")}`)
      this.spawnCommandSync("git", ["init"])      
    }
    this.spawnCommandSync("git", ["add", "."])   
    this.spawnCommandSync("git", ["commit", "-am", "First Commit"])   
    if (this.tool_answers.precommit) {
      this.log("\n\n");
      this.log(`${chalk.cyan("\nINSTALLING PRE-COMMIT TOOLS")}`)
      if (os.platform() === "linux" ) { 
        this.log("*** Installing with apt-get ***")
        this.spawnCommandSync("sudo", ["apt-get", "install", "python3-pip"])
        this.spawnCommandSync("sudo", ["apt-get", "install", "terraform=0.12.30"])
      }
      this.spawnCommandSync("pip3", ["install", "pre-commit"])
      this.spawnCommandSync("pip3", ["install", "checkov"])
      this.log(`${chalk.cyan("\nRUNNING PRE-COMMIT CHECKS")}`)
      this.spawnCommandSync("pre-commit", ["run", "-a"])
    }
  }

};

