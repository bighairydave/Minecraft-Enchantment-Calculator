// Revision info
var revisionName = "rev5";

// Form validation
var currentEnchType;

// Calculation variables
var enchantability;
var modifiedLevel;
var possibleEnchants = new Array();
var enchantsReceived = new Object();
var precision = 10000;
var isRecordingEnchants = false;
var enchantWanted;
var recordedEnchant = new Object();
var endPrecision = 0;

// Avoid `console` errors in browsers that lack a console.
if (!(window.console && console.log)) {
    (function() {
        var noop = function() {};
        var methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'markTimeline', 'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'];
        var length = methods.length;
        var console = window.console = {};
        while (length--) {
            console[methods[length]] = noop;
        }
    }());
}

// onPageLoad
$(function() {
    // Google +1 init
    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
    po.src = 'https://apis.google.com/js/plusone.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);

    /*

        Funciton called when the user changes the version

    */

    $("#version").change(function(){
        var version = $("#version").val();

        if (version == "rev4") {
            window.open("../rev4/index.html", "_self");
        } else if (version == "rev5") {
            window.open("../rev5/index.html", "_self");
        }
    });

    /*

        Function called when the main calculator's material is changed, keeps tools and materials valid

    */
    $("#material").change(function(){
        var mat = $("#material").val();
        var tool = $("#tool").val();

        if ((tool == "bow" || tool == "fishing rod") && mat != "wood") {  // Check for bow or fishing rod
            if (mat == "leather" || mat == "chain") {
                $("#tool").val("chestplate");
            } else if (mat == "book") {
                $("#tool").val("book");
            } else {
                $("#tool").val("sword");
            }
        } else if (tool == "book" && mat != "book") {  // Check for book as tool
            if (mat == "leather" || mat == "chain") {
                $("#tool").val("chestplate");
            } else {
                $("#tool").val("sword");
            }
        } else if (mat == "book" && tool != "book") {  // Check for book as material
            $("#tool").val("book");
        } else if ((tool == "boots" || tool == "leggings" || tool == "chestplate" || tool == "helmet") && !(mat == "leather" || mat == "iron" || mat == "gold" || mat == "diamond" || mat == "chain")) {  // Check for armour
            $("#tool").val("sword");
        } else if ((tool == "axe" || tool == "sword" || tool == "pickaxe" || tool == "shovel") && !(mat == "iron" || mat == "gold" || mat == "diamond" || mat == "stone" || mat == "wood")) {  // Check for tools
            $("#tool").val("chestplate");
        }
    });

    /*

        Function called when the main calculator's tool is changed, keeps tools and materials valid

    */
    $("#tool").change(function(){
        var mat = $("#material").val();
        var tool = $("#tool").val();

        if (tool == "bow" && mat != "wood") {  // Check for bow
            $("#material").val("wood");
        } else if (tool == "fishing rod" && mat != "wood") { // Check for fishing rod
            $("#material").val("wood");
        } else if (tool == "book" && mat != "book") {  // Check for book
            $("#material").val("book");
        } else if ((tool == "boots" || tool == "leggings" || tool == "chestplate" || tool == "helmet") && !(mat == "leather" || mat == "iron" || mat == "gold" || mat == "diamond" || mat == "chain")) {  // Check for armour
            $("#material").val("diamond");
        } else if ((tool == "axe" || tool == "sword" || tool == "pickaxe" || tool == "shovel") && !(mat == "iron" || mat == "gold" || mat == "diamond" || mat == "stone" || mat == "wood")) {  // Check for tools
            $("#material").val("diamond");
        }
    });

    /*

        Function called when the 2nd calculator's material is changed, keeps tools and materials valid

    */
    $("#revmaterial").change(function(){
        var mat = $("#revmaterial").val();
        var tool = $("#revtool").val();

        if ((tool == "bow" || tool == "fishing rod") && mat != "wood") {  // Check for bow
            if (mat == "leather" || mat == "chain") {
                $("#revtool").val("chestplate");
            } else if (mat == "book") {
                $("#revtool").val("book");
            } else {
                $("#revtool").val("sword");
            }
        } else if (tool == "book" && mat != "book") {  // Check for book as tool
            if (mat == "leather" || mat == "chain") {
                $("#revtool").val("chestplate");
            } else {
                $("#revtool").val("sword");
            }
        } else if (mat == "book" && tool != "book") {  // Check for book as material
            $("#revtool").val("book");
        } else if ((tool == "boots" || tool == "leggings" || tool == "chestplate" || tool == "helmet") && !(mat == "leather" || mat == "iron" || mat == "gold" || mat == "diamond" || mat == "chain")) {  // Check for armour
            $("#revtool").val("sword");
        } else if ((tool == "axe" || tool == "sword" || tool == "pickaxe" || tool == "shovel") && !(mat == "iron" || mat == "gold" || mat == "diamond" || mat == "stone" || mat == "wood")) {  // Check for tools
            $("#revtool").val("chestplate");
        }

        // Change enchantment type depending on weapon
        updateEnchType ();
    });

    /*

        Function called when the 2nd calculator's tool is changed, keeps tools and materials valid

    */
    $("#revtool").change(function(){
        var mat = $("#revmaterial").val();
        var tool = $("#revtool").val();

        if (tool == "bow" && mat != "wood") {  // Check for bow
            $("#revmaterial").val("wood");
        } else if (tool == "fishing rod" && mat != "wood") { // Check for fishing rod
            $("#revmaterial").val("wood");
        } else if (tool == "book" && mat != "book") {  // Check for book
            $("#revmaterial").val("book");
        } else if ((tool == "boots" || tool == "leggings" || tool == "chestplate" || tool == "helmet") && !(mat == "leather" || mat == "iron" || mat == "gold" || mat == "diamond" || mat == "chain")) {  // Check for armour
            $("#revmaterial").val("diamond");
        } else if ((tool == "axe" || tool == "sword" || tool == "pickaxe" || tool == "shovel") && !(mat == "iron" || mat == "gold" || mat == "diamond" || mat == "stone" || mat == "wood")) {  // Check for tools
            $("#revmaterial").val("diamond");
        }

        // Change enchanting type depending on weapon
        updateEnchType ();
    });

    /*

        Function called while typing in a level, ensures input is a number between 1 and 30

    */
    $("#level").keyup(function(){
        $("#level").val($("#level").val().replace(/[^0-9]/g,''));
        if (parseInt($("#level").val()) > 30) {
            $("#level").val("30");
        } else if (parseInt($("#level").val()) == 0) {
            $("#level").val("1");
        }
    });

    /*

        Function changes the enchant levels whenever a different enchant is chosen

    */
    $("#enchant").change(changeEnchLevels);

    /*

        When the user clicks the calculate button

    */
    $("#calc").click(function(){
        _gaq.push(['_trackEvent', 'Calculate', 'Calculate Level ' + $("#level").val() + ' on a ' + $("#material").val() + ' ' + $("#tool").val()]);
        $("#main_window").css("border-bottom", "solid 1px #aaaaaa");
        $("#result").css("border-top", "solid 1px #eeeeee");
        $("#reverse_calc").animate({
            height: "0px"
        }, 500);
        $("#or").animate({
            height: "0px"
        }, 500, function() {
            $("#result").html("Result:<br/ ><textarea id=\"outputArea\"></textarea><br /><div id=\"linkdiv\">Link: <input type=\"text\" id=\"link\" /></div><input type=\"button\" id=\"calcback\" value=\"Back\" />");
            $("#link").val("http://www.minecraftenchantmentcalculator.com/" + revisionName + "/#" + getQuickCode(1));
            calc($("#material").val(), $("#tool").val(), $("#level").val());  // Calculate enchants, write output to output text area
            $("#link").click(function(){$("#link")[0].select();});  // Highlight entire quick link when the user clicks the link text box
            $("#result").animate({
                height: "300px"
            }, 500, function() {
                $("#calcback").click(function(){  // Close the result when the user clicks back
                    $("#main_window").css("border-bottom", "none");
                    $("#result").css("border-top", "none");
                    $("#result").animate({
                        height: "5px"
                    }, 500, function() {
                        $("#result").html("");
                        $("#reverse_calc").animate({
                            height: "70px"
                        }, 500);
                        $("#or").animate({
                            height: "40px"
                        }, 500);
                    });
                });
            });
        });
    });

    /*

        Calculate button click for 2nd calculator

    */
    $("#revcalc").click(function(){
        _gaq.push(['_trackEvent', 'Calculate', 'Reverse Calculate: ' + $("#enchant option:selected").text() + ' ' + $("#enchlevel option:selected").text() + " on a " + $("#revmaterial").val() + ' ' + $("#revtool").val()]);
        $("#main_window").css("border-bottom", "solid 1px #aaaaaa");
        $("#result").css("border-top", "solid 1px #eeeeee");
        $("#normal_calc").animate({
            height: "0px"
        }, 500);
        $("#or").animate({
            height: "0px"
        }, 500, function() {
            $("#result").html("Result:<br/ ><textarea id=\"outputArea\"></textarea><br /><div id=\"linkdiv\">Link: <input type=\"text\" id=\"link\" /></div><input type=\"button\" id=\"calcback\" value=\"Back\" />");
            $("#link").val("http://www.minecraftenchantmentcalculator.com/" + revisionName + "/#" + getQuickCode(2));
            revCalc ($("#enchant option:selected").text() + " " + $("#enchlevel option:selected").text(), $("#revmaterial").val(), $("#revtool").val());  // Run 2nd calculator and output to the output text area
            $("#link").click(function(){$("#link")[0].select();});  // Highlight entire link when the user clicks the text box
            $("#result").animate({
                height: "300px"
            }, 500, function() {
                $("#calcback").click(function(){  // Close the result when the user clicks back
                    $("#main_window").css("border-bottom", "none");
                    $("#result").css("border-top", "none");
                    $("#result").animate({
                        height: "5px"
                    }, 500, function() {
                        $("#result").html("");
                        $("#normal_calc").animate({
                            height: "70px"
                        }, 500);
                        $("#or").animate({
                            height: "40px"
                        }, 500);
                    });
                });
            });
        });
    });

    // Update list of enchants
    updateEnchType ();

    // Handles quick codes if the url contains one
    if (window.location.hash.replace("#", "") != "") {
        var quickCode = window.location.hash.replace("#", "");
        _gaq.push(['_trackEvent', 'QuickCode', 'Code ' + quickCode]);
        if (quickCode.charAt(0) == "1") {
            console.debug("Type 1 quick code detected. " + quickCode);
            $("#material option").eq(parseInt(quickCode.charAt(1))).attr("selected", "selected");
            $("#tool option").eq(parseInt(quickCode.charAt(2))).attr("selected", "selected");
            $("#level").val(quickCode.substr(3, 2));
            $("#calc").click();
        } else if (quickCode.charAt(0) == "2") {
            console.debug("Type 2 quick code detected. " + quickCode);
            $("#revmaterial option").eq(parseInt(quickCode.charAt(1))).attr("selected", "selected");
            $("#revtool option").eq(parseInt(quickCode.charAt(2))).attr("selected", "selected");
            updateEnchType ()
            // Check if quickcode is longer than ususal
            if (quickCode.length > 5) {
                $("#enchant option").eq(parseInt(quickCode.charAt(3) + quickCode.charAt(4))).attr("selected", "selected");
                changeEnchLevels();
                $("#enchlevel option").eq(parseInt(quickCode.charAt(5))).attr("selected", "selected");
            } else {
                $("#enchant option").eq(parseInt(quickCode.charAt(3))).attr("selected", "selected");
                changeEnchLevels();
                $("#enchlevel option").eq(parseInt(quickCode.charAt(4))).attr("selected", "selected");
            }
            $("#revcalc").click();
        }
    }
});

/*

    Creates a quick code for use in the link text box under results

*/
function getQuickCode(type) {
    // Type 1 is normal calculator, 2 is the 2nd calculator
    if (type == 1) {
        return "1" + $("#material")[0].selectedIndex + $("#tool")[0].selectedIndex + $("#level").val();
    } else if (type == 2) {
        return "2" + $("#revmaterial")[0].selectedIndex + $("#revtool")[0].selectedIndex + $("#enchant")[0].selectedIndex + $("#enchlevel")[0].selectedIndex;
    }
}

/*

    Updates enchants listed depending on type of tool or armour

*/
function updateEnchType () {
    var newEnchType;
    if ($("#revtool").val() == "pickaxe" || $("#revtool").val() == "axe" || $("#revtool").val() == "shovel") {
        newEnchType = "tool";
    } else {
        newEnchType = $("#revtool").val();
    }

    if (newEnchType == currentEnchType) {
        return;  // Stops the browser from resetting values whenever a different piece of armour with the same enchant is chosen
    } else {
        currentEnchType = newEnchType;
    }

    var newOptions;

    if (newEnchType == "book") {
        newOptions = {"Aqua Affinity": "aquaaffinity",
          "Bane of Arthropods": "boa",
          "Blast Protection": "blastprot",
          "Efficiency": "efficiency",
          "Feather Falling": "featherfalling",
          "Fire Aspect": "fireaspect",
          "Fire Protection": "fireprot",
          "Flame": "flame",
          "Fortune": "fortune",
          "Infinity": "infinity",
          "Knockback": "knockback",
          "Looting": "looting",
          "Luck of the Sea": "luckofthesea",
          "Lure": "lure",
          "Power": "power",
          "Projectile Protection": "projprot",
          "Protection": "protection",
          "Punch": "punch",
          "Respiration": "respiration",
          "Sharpness": "sharpness",
          "Silk Touch": "silktouch",
          "Smite": "smite",
          "Thorns": "thorns",
          "Unbreaking": "unbreaking"
        };
    } else if (newEnchType == "sword") {
        newOptions = {"Sharpness": "sharpness",
          "Smite": "smite",
          "Bane of Arthropods": "boa",
          "Fire Aspect": "fireaspect",
          "Looting": "looting",
          "Knockback": "knockback",
          "Unbreaking": "unbreaking"
        };
    } else if (newEnchType == "bow") {
        newOptions = {"Power": "power",
          "Punch": "punch",
          "Flame": "flame",
          "Infinity": "infinity",
          "Unbreaking": "unbreaking"
        };
    } else if (newEnchType == "tool") {
        newOptions = {"Unbreaking": "unbreaking",
          "Efficiency": "efficiency",
          "Silk Touch": "silktouch",
          "Fortune": "fortune"
        };
    } else if (newEnchType == "chestplate") {
        newOptions = {"Protection": "protection",
          "Fire Protection": "fireprot",
          "Projectile Protection": "projprot",
          "Blast Protection": "blastprot",
          "Thorns": "thorns",
          "Unbreaking": "unbreaking"
        };
    } else if (newEnchType == "leggings") {
        newOptions = {"Protection": "protection",
          "Fire Protection": "fireprot",
          "Projectile Protection": "projprot",
          "Blast Protection": "blastprot",
          "Unbreaking": "unbreaking"
        };
    } else if (newEnchType == "boots") {
        newOptions = {"Protection": "protection",
          "Fire Protection": "fireprot",
          "Projectile Protection": "projprot",
          "Blast Protection": "blastprot",
          "Feather Falling": "featherfalling",
          "Unbreaking": "unbreaking"
        };
    } else if (newEnchType == "helmet") {
        newOptions = {"Protection": "protection",
          "Fire Protection": "fireprot",
          "Projectile Protection": "projprot",
          "Blast Protection": "blastprot",
          "Aqua Affinity": "aquaaffinity",
          "Respiration": "respiration",
          "Unbreaking": "unbreaking"
        };
    } else if (newEnchType == "fishing rod") {
        newOptions = {"Luck of the Sea": "luckofthesea",
          "Lure": "lure",
          "Unbreaking": "unbreaking"
        };
    }

    // Applies new key value pairs to the list of enchants
    var $el = $("#enchant");
    $el.empty();
    $.each(newOptions, function(key, value) {
      $el.append($("<option></option>")
         .attr("value", value).text(key));
    });

    changeEnchLevels();  // Updates newly selected enchant's possible levels
}

/*

    Updates min and max levels depending on the currently selected enchant

*/
function changeEnchLevels() {
    var enchName = $("#enchant").val();
    var newLvOptions;

    if (enchName == "sharpness" || enchName == "smite" || enchName == "boa" || enchName == "efficiency" || enchName == "power") {
        newLvOptions = {"IV": "4",  // 4 before 5, because 5 is impossible to get on anything useful
          "V": "5",
          "III": "3",
          "II": "2",
          "I": "1"
        };
    } else if (enchName == "protection" || enchName == "fireprot" || enchName == "projprot" || enchName == "blastprot" || enchName == "featherfalling") {
        newLvOptions = {"IV": "4",
          "III": "3",
          "II": "2",
          "I": "1"
        };
    } else if (enchName == "respiration" || enchName == "looting" || enchName == "unbreaking" || enchName == "fortune" || enchName == "thorns" || enchName == "luckofthesea" || enchName == "lure") {
        newLvOptions = {"III": "3",
          "II": "2",
          "I": "1"
        };
    } else if (enchName == "knockback" || enchName == "fireaspect" || enchName == "punch") {
        newLvOptions = {"II": "2",
          "I": "1"
        };
    } else if (enchName == "flame" || enchName == "infinity" || enchName == "silktouch" || enchName == "aquaaffinity") {
        newLvOptions = {"I": "1"};
    }

    // Applies the new key value pairs to the list of levels
    var $el = $("#enchlevel");
    $el.empty();
    $.each(newLvOptions, function(key, value) {
      $el.append($("<option></option>")
         .attr("value", value).text(key));
    });
}

/*

    Writes a line to the result output

*/
function writeLineToOutput (s) {
    $("#outputArea").val($("#outputArea").val() + s + "\n");
}

/*

    Adds enchant to possible enchant list once for each weight

*/
function addWeights (weight, newEnchant) {
    for (var i = 0; i < weight; i++) {
        possibleEnchants.push(newEnchant);
    }
}

/*

    Runs calc once for every level, outputting the chance of getting enchantName for each level

*/
function revCalc (enchantName, mat, tool) {
    writeLineToOutput ("Minecraft Enchanting Calculator for Minecraft version 1.7 and later - http://www.minecraftenchantmentcalculator.com/");
    writeLineToOutput ("");
    writeLineToOutput ("Output log:  (Each level is calculated 10,000 times, but results may still vary)");
    if (mat == "book") {
        writeLineToOutput ("Possible levels for a " + enchantName + " book...");
    } else {
        writeLineToOutput ("Possible levels for a " + enchantName + " " + mat + " " + tool + "...");
    }

    // Show errors for impossible enchants
    if (enchantName == "Power V") {
        writeLineToOutput ("Error: Power V is only obtainable by repairing two Power IV bows in an anvil.");
        return;
    }

    if (enchantName == "Sharpness V" && mat != "gold") {
        writeLineToOutput ("Error: Sharpness V is only obtainable on a gold sword, or by repairing two Sharpness IV swords in an anvil.");
        return;
    }

    // Notice about Thorns III being pretty much impossible

    if (enchantName == "Thorns III") {
        writeLineToOutput ("");
        writeLineToOutput ("IMPORTANT NOTICE ABOUT THORNS III:");
        writeLineToOutput ("Thorns III is almost impossible to create, and can only be obtained on a gold chestplate at less than a 0.1% chance at level 30.");
        writeLineToOutput ("Use Thorns II for now.");
        writeLineToOutput ("");
    }

    // Notice about Lure and Luck of the Sea

    if (enchantName == "Lure" || enchantName == "Luck of the Sea") {
        writeLineToOutput ("");
        writeLineToOutput ("Lure and Luck of the Sea are new, therefore this output may be incorrect.");
        writeLineToOutput ("");
    }

    // Run calculation once for each level
    enchantWanted = enchantName;
    isRecordingEnchants = true;
    for (var level = 1; level <= 30; level++) {
        calc(mat, tool, level);
    }

    // Write each level to the output
    for (var index in recordedEnchant) {
        if(isNaN(recordedEnchant[index])) {
            continue;
        }
        if(recordedEnchant[index] == 0) {
            writeLineToOutput (index + ": <0.1%");
            continue;
        }
        recordedEnchant[index] = Math.floor(recordedEnchant[index] * 10)/10;  // Round percentages to two decimal places
        writeLineToOutput (index + ": " + recordedEnchant[index] + "%");
    }
    isRecordingEnchants = false;
}

/*

    Main calculator, calculates possible enchants for a specific tool at a specific level

*/
function calc(mat, tool, level) {
    enchantsReceived = new Object();
    endPrecision = 0;

    // Set enchantability value of each tool
    if (tool == "bow" || tool == "book" || tool == "fishing rod") {
        enchantability = 1;
    } else if (tool == "axe" || tool == "pickaxe" || tool == "shovel" || tool == "sword") {
        if (mat == "wood") {
            enchantability = 15;
        } else if (mat == "stone") {
            enchantability = 5;
        } else if (mat == "iron") {
            enchantability = 14;
        } else if (mat == "diamond") {
            enchantability = 10;
        } else if (mat == "gold") {
            enchantability = 22;
        }
    } else if (tool == "leggings" || tool == "boots" || tool == "chestplate" || tool == "helmet") {
        if (mat == "leather") {
            enchantability = 15;
        } else if (mat == "iron") {
            enchantability = 9;
        } else if (mat == "chain") {
            enchantability = 12;
        } else if (mat == "diamond") {
            enchantability = 10;
        } else if (mat == "gold") {
            enchantability = 25;
        }
    }

    // Calculator runs 10,000 times currently (depending on precision value, higher takes longer and sometimes doesn't even finish), works out the average chance for each enchant
    for (var i = 0; i < precision; i++) {
        possibleEnchants = new Array();

        // Randomisation which actually picks the enchant
        modifiedLevel = parseInt(level) + Math.floor(Math.random() * (Math.floor(enchantability / 4) + 1)) + Math.floor(Math.random() * (Math.floor(enchantability / 4) + 1)) + 1;
        modifiedLevel = Math.floor(modifiedLevel * ((Math.random() + Math.random() - 1) * 0.15 + 1) + 0.5);

        // Depending on the modifiedLevel above, add enchants to the list of possible enchants a few times depending on the enchant's weight

        if (tool == "fishing rod") {
            if (modifiedLevel >= 33 && modifiedLevel <= 70) {
                addWeights(1, "Lure III");
                addWeights(1, "Luck of the Sea III");
            } else if (modifiedLevel >= 24 && modifiedLevel <= 60) {
                addWeights(1, "Lure II");
                addWeights(1, "Luck of the Sea II");
            } else if (modifiedLevel >= 15 && modifiedLevel <= 50) {
                addWeights(1, "Lure I");
                addWeights(1, "Luck of the Sea I");
            }

            if (modifiedLevel >= 21 && modifiedLevel <= 71) {
                addWeights(5, "Unbreaking III");
            } else if (modifiedLevel >= 13 && modifiedLevel <= 63) {
                addWeights(5, "Unbreaking II");
            } else if (modifiedLevel >= 5 && modifiedLevel <= 55) {
                addWeights(5, "Unbreaking I");
            }
        } else if (tool == "bow") {
            if (modifiedLevel >= 41 && modifiedLevel <= 56) {
                addWeights(10, "Power V");
            } else if (modifiedLevel >= 31 && modifiedLevel <= 46) {
                addWeights(10, "Power IV");
            } else if (modifiedLevel >= 21 && modifiedLevel <= 36) {
                addWeights(10, "Power III");
            } else if (modifiedLevel >= 11 && modifiedLevel <= 26) {
                addWeights(10, "Power II");
            } else if (modifiedLevel >= 1 && modifiedLevel <= 16) {
                addWeights(10, "Power I");
            }

            if (modifiedLevel >= 32 && modifiedLevel <= 57) {
                addWeights(2, "Punch II");
            } else if (modifiedLevel >= 12 && modifiedLevel <= 37) {
                addWeights(2, "Punch I");
            }

            if (modifiedLevel >= 20 && modifiedLevel <= 50) {
                addWeights(1, "Infinity I");
                addWeights(2, "Flame I");
            }

            if (modifiedLevel >= 21 && modifiedLevel <= 71) {
                addWeights(5, "Unbreaking III");
            } else if (modifiedLevel >= 13 && modifiedLevel <= 63) {
                addWeights(5, "Unbreaking II");
            } else if (modifiedLevel >= 5 && modifiedLevel <= 55) {
                addWeights(5, "Unbreaking I");
            }
        } else if (tool == "axe" || tool == "pickaxe" || tool == "shovel") {
            if (modifiedLevel >= 41 && modifiedLevel <= 91) {
                addWeights(10, "Efficiency V");
            } else if (modifiedLevel >= 31 && modifiedLevel <= 81) {
                addWeights(10, "Efficiency IV");
            } else if (modifiedLevel >= 21 && modifiedLevel <= 71) {
                addWeights(10, "Efficiency III");
            } else if (modifiedLevel >= 11 && modifiedLevel <= 61) {
                addWeights(10, "Efficiency II");
            } else if (modifiedLevel >= 1 && modifiedLevel <= 51) {
                addWeights(10, "Efficiency I");
            }

            if (modifiedLevel >= 15 && modifiedLevel <= 65) {
                addWeights(1, "Silk Touch I");
            }

            if (modifiedLevel >= 21 && modifiedLevel <= 71) {
                addWeights(5, "Unbreaking III");
            } else if (modifiedLevel >= 13 && modifiedLevel <= 63) {
                addWeights(5, "Unbreaking II");
            } else if (modifiedLevel >= 5 && modifiedLevel <= 55) {
                addWeights(5, "Unbreaking I");
            }

            if (modifiedLevel >= 33 && modifiedLevel <= 83) {
                addWeights(2, "Fortune III");
            } else if (modifiedLevel >= 24 && modifiedLevel <= 74) {
                addWeights(2, "Fortune II");
            } else if (modifiedLevel >= 15 && modifiedLevel <= 65) {
                addWeights(2, "Fortune I");
            }
        } else if (tool == "sword") {
            if (modifiedLevel >= 45 && modifiedLevel <= 65) {
                addWeights(10, "Sharpness V");
            } else if (modifiedLevel >= 34 && modifiedLevel <= 54) {
                addWeights(10, "Sharpness IV");
            } else if (modifiedLevel >= 23 && modifiedLevel <= 43) {
                addWeights(10, "Sharpness III");
            } else if (modifiedLevel >= 12 && modifiedLevel <= 32) {
                addWeights(10, "Sharpness II");
            } else if (modifiedLevel >= 1 && modifiedLevel <= 21) {
                addWeights(10, "Sharpness I");
            }

            if (modifiedLevel >= 37 && modifiedLevel <= 57) {
                addWeights(5, "Smite V");
                addWeights(5, "Bane of Arthropods V");
            } else if (modifiedLevel >= 29 && modifiedLevel <= 49) {
                addWeights(5, "Smite IV");
                addWeights(5, "Bane of Arthropods IV");
            } else if (modifiedLevel >= 21 && modifiedLevel <= 41) {
                addWeights(5, "Smite III");
                addWeights(5, "Bane of Arthropods III");
            } else if (modifiedLevel >= 13 && modifiedLevel <= 33) {
                addWeights(5, "Smite II");
                addWeights(5, "Bane of Arthropods II");
            } else if (modifiedLevel >= 5 && modifiedLevel <= 25) {
                addWeights(5, "Smite I");
                addWeights(5, "Bane of Arthropods I");
            }

            if (modifiedLevel >= 25 && modifiedLevel <= 75) {
                addWeights(5, "Knockback II");
            } else if (modifiedLevel >= 5 && modifiedLevel <= 55) {
                addWeights(5, "Knockback I");
            }

            if (modifiedLevel >= 30 && modifiedLevel <= 80) {
                addWeights(2, "Fire Aspect II");
            } else if (modifiedLevel >= 10 && modifiedLevel <= 60) {
                addWeights(2, "Fire Aspect I");
            }

            if (modifiedLevel >= 33 && modifiedLevel <= 83) {
                addWeights(2, "Looting III");
            } else if (modifiedLevel >= 24 && modifiedLevel <= 74) {
                addWeights(2, "Looting II");
            } else if (modifiedLevel >= 15 && modifiedLevel <= 65) {
                addWeights(2, "Looting I");
            }
            
            if (modifiedLevel >= 21 && modifiedLevel <= 71) {
                addWeights(5, "Unbreaking III");
            } else if (modifiedLevel >= 13 && modifiedLevel <= 63) {
                addWeights(5, "Unbreaking II");
            } else if (modifiedLevel >= 5 && modifiedLevel <= 55) {
                addWeights(5, "Unbreaking I");
            }
        } else if (tool == "boots" || tool == "leggings" || tool == "chestplate" || tool == "helmet") {
            if (modifiedLevel >= 34 && modifiedLevel <= 54) {
                addWeights(10, "Protection IV");
            } else if (modifiedLevel >= 23 && modifiedLevel <= 43) {
                addWeights(10, "Protection III");
            } else if (modifiedLevel >= 12 && modifiedLevel <= 32) {
                addWeights(10, "Protection II");
            } else if (modifiedLevel >= 1 && modifiedLevel <= 21) {
                addWeights(10, "Protection I");
            }

            if (modifiedLevel >= 34 && modifiedLevel <= 46) {
                addWeights(5, "Fire Protection IV");
            } else if (modifiedLevel >= 26 && modifiedLevel <= 38) {
                addWeights(5, "Fire Protection III");
            } else if (modifiedLevel >= 18 && modifiedLevel <= 30) {
                addWeights(5, "Fire Protection II");
            } else if (modifiedLevel >= 10 && modifiedLevel <= 22) {
                addWeights(5, "Fire Protection I");
            }

            if (modifiedLevel >= 29 && modifiedLevel <= 41) {
                addWeights(2, "Blast Protection IV");
            } else if (modifiedLevel >= 21 && modifiedLevel <= 33) {
                addWeights(2, "Blast Protection III");
            } else if (modifiedLevel >= 13 && modifiedLevel <= 25) {
                addWeights(2, "Blast Protection II");
            } else if (modifiedLevel >= 5 && modifiedLevel <= 17) {
                addWeights(2, "Blast Protection I");
            }

            if (modifiedLevel >= 21 && modifiedLevel <= 36) {
                addWeights(5, "Projectile Protection IV");
            } else if (modifiedLevel >= 15 && modifiedLevel <= 30) {
                addWeights(5, "Projectile Protection III");
            } else if (modifiedLevel >= 9 && modifiedLevel <= 24) {
                addWeights(5, "Projectile Protection II");
            } else if (modifiedLevel >= 3 && modifiedLevel <= 18) {
                addWeights(5, "Projectile Protection I");
            }
            
            if (modifiedLevel >= 21 && modifiedLevel <= 71) {
                addWeights(5, "Unbreaking III");
            } else if (modifiedLevel >= 13 && modifiedLevel <= 63) {
                addWeights(5, "Unbreaking II");
            } else if (modifiedLevel >= 5 && modifiedLevel <= 55) {
                addWeights(5, "Unbreaking I");
            }

            // Extra enchants for boots and helmets
            if (tool == "boots") {
                if (modifiedLevel >= 23 && modifiedLevel <= 33) {
                    addWeights(5, "Feather Falling IV");
                } else if (modifiedLevel >= 17 && modifiedLevel <= 27) {
                    addWeights(5, "Feather Falling III");
                } else if (modifiedLevel >= 11 && modifiedLevel <= 21) {
                    addWeights(5, "Feather Falling II");
                } else if (modifiedLevel >= 5 && modifiedLevel <= 15) {
                    addWeights(5, "Feather Falling I");
                }
            }

            if (tool == "helmet") {
                if (modifiedLevel >= 30 && modifiedLevel <= 60) {
                    addWeights(2, "Respiration III");
                } else if (modifiedLevel >= 20 && modifiedLevel <= 50) {
                    addWeights(2, "Respiration II");
                } else if (modifiedLevel >= 10 && modifiedLevel <= 40) {
                    addWeights(2, "Respiration I");
                }

                if (modifiedLevel >= 1 && modifiedLevel <= 41) {
                    addWeights(2, "Aqua Affinity I");
                }
            }

            if (tool == "chestplate") {
                if (modifiedLevel >= 50 && modifiedLevel <= 100) {
                    addWeights(1, "Thorns III");
                } else if (modifiedLevel >= 30 && modifiedLevel <= 80) {
                    addWeights(1, "Thorns II");
                } else if (modifiedLevel >= 10 && modifiedLevel <= 60) {
                    addWeights(1, "Thorns I");
                }
            }
        } else if (tool == "book") {
            // Books can get every enchant
            if (modifiedLevel >= 50 && modifiedLevel <= 100) {
                addWeights(1, "Thorns III");
            } else if (modifiedLevel >= 30 && modifiedLevel <= 80) {
                addWeights(1, "Thorns II");
            } else if (modifiedLevel >= 10 && modifiedLevel <= 60) {
                addWeights(1, "Thorns I");
            }

            if (modifiedLevel >= 30 && modifiedLevel <= 60) {
                addWeights(2, "Respiration III");
            } else if (modifiedLevel >= 20 && modifiedLevel <= 50) {
                addWeights(2, "Respiration II");
            } else if (modifiedLevel >= 10 && modifiedLevel <= 40) {
                addWeights(2, "Respiration I");
            }

            if (modifiedLevel >= 1 && modifiedLevel <= 41) {
                addWeights(2, "Aqua Affinity I");
            }

            if (modifiedLevel >= 23 && modifiedLevel <= 33) {
                addWeights(5, "Feather Falling IV");
            } else if (modifiedLevel >= 17 && modifiedLevel <= 27) {
                addWeights(5, "Feather Falling III");
            } else if (modifiedLevel >= 11 && modifiedLevel <= 21) {
                addWeights(5, "Feather Falling II");
            } else if (modifiedLevel >= 5 && modifiedLevel <= 15) {
                addWeights(5, "Feather Falling I");
            }

            if (modifiedLevel >= 34 && modifiedLevel <= 54) {
                addWeights(10, "Protection IV");
            } else if (modifiedLevel >= 23 && modifiedLevel <= 43) {
                addWeights(10, "Protection III");
            } else if (modifiedLevel >= 12 && modifiedLevel <= 32) {
                addWeights(10, "Protection II");
            } else if (modifiedLevel >= 1 && modifiedLevel <= 21) {
                addWeights(10, "Protection I");
            }

            if (modifiedLevel >= 34 && modifiedLevel <= 46) {
                addWeights(5, "Fire Protection IV");
            } else if (modifiedLevel >= 26 && modifiedLevel <= 38) {
                addWeights(5, "Fire Protection III");
            } else if (modifiedLevel >= 18 && modifiedLevel <= 30) {
                addWeights(5, "Fire Protection II");
            } else if (modifiedLevel >= 10 && modifiedLevel <= 22) {
                addWeights(5, "Fire Protection I");
            }

            if (modifiedLevel >= 29 && modifiedLevel <= 41) {
                addWeights(2, "Blast Protection IV");
            } else if (modifiedLevel >= 21 && modifiedLevel <= 33) {
                addWeights(2, "Blast Protection III");
            } else if (modifiedLevel >= 13 && modifiedLevel <= 25) {
                addWeights(2, "Blast Protection II");
            } else if (modifiedLevel >= 5 && modifiedLevel <= 17) {
                addWeights(2, "Blast Protection I");
            }

            if (modifiedLevel >= 21 && modifiedLevel <= 36) {
                addWeights(5, "Projectile Protection IV");
            } else if (modifiedLevel >= 15 && modifiedLevel <= 30) {
                addWeights(5, "Projectile Protection III");
            } else if (modifiedLevel >= 9 && modifiedLevel <= 24) {
                addWeights(5, "Projectile Protection II");
            } else if (modifiedLevel >= 3 && modifiedLevel <= 18) {
                addWeights(5, "Projectile Protection I");
            }

            if (modifiedLevel >= 45 && modifiedLevel <= 65) {
                addWeights(10, "Sharpness V");
            } else if (modifiedLevel >= 34 && modifiedLevel <= 54) {
                addWeights(10, "Sharpness IV");
            } else if (modifiedLevel >= 23 && modifiedLevel <= 43) {
                addWeights(10, "Sharpness III");
            } else if (modifiedLevel >= 12 && modifiedLevel <= 32) {
                addWeights(10, "Sharpness II");
            } else if (modifiedLevel >= 1 && modifiedLevel <= 21) {
                addWeights(10, "Sharpness I");
            }

            if (modifiedLevel >= 37 && modifiedLevel <= 57) {
                addWeights(5, "Smite V");
                addWeights(5, "Bane of Arthropods V");
            } else if (modifiedLevel >= 29 && modifiedLevel <= 49) {
                addWeights(5, "Smite IV");
                addWeights(5, "Bane of Arthropods IV");
            } else if (modifiedLevel >= 21 && modifiedLevel <= 41) {
                addWeights(5, "Smite III");
                addWeights(5, "Bane of Arthropods III");
            } else if (modifiedLevel >= 13 && modifiedLevel <= 33) {
                addWeights(5, "Smite II");
                addWeights(5, "Bane of Arthropods II");
            } else if (modifiedLevel >= 5 && modifiedLevel <= 25) {
                addWeights(5, "Smite I");
                addWeights(5, "Bane of Arthropods I");
            }

            if (modifiedLevel >= 25 && modifiedLevel <= 75) {
                addWeights(5, "Knockback II");
            } else if (modifiedLevel >= 5 && modifiedLevel <= 55) {
                addWeights(5, "Knockback I");
            }

            if (modifiedLevel >= 30 && modifiedLevel <= 80) {
                addWeights(2, "Fire Aspect II");
            } else if (modifiedLevel >= 10 && modifiedLevel <= 60) {
                addWeights(2, "Fire Aspect I");
            }

            if (modifiedLevel >= 33 && modifiedLevel <= 83) {
                addWeights(2, "Looting III");
            } else if (modifiedLevel >= 24 && modifiedLevel <= 74) {
                addWeights(2, "Looting II");
            } else if (modifiedLevel >= 15 && modifiedLevel <= 65) {
                addWeights(2, "Looting I");
            }

            if (modifiedLevel >= 41 && modifiedLevel <= 91) {
                addWeights(10, "Efficiency V");
            } else if (modifiedLevel >= 31 && modifiedLevel <= 81) {
                addWeights(10, "Efficiency IV");
            } else if (modifiedLevel >= 21 && modifiedLevel <= 71) {
                addWeights(10, "Efficiency III");
            } else if (modifiedLevel >= 11 && modifiedLevel <= 61) {
                addWeights(10, "Efficiency II");
            } else if (modifiedLevel >= 1 && modifiedLevel <= 51) {
                addWeights(10, "Efficiency I");
            }

            if (modifiedLevel >= 15 && modifiedLevel <= 65) {
                addWeights(1, "Silk Touch I");
            }

            if (modifiedLevel >= 21 && modifiedLevel <= 71) {
                addWeights(5, "Unbreaking III");
            } else if (modifiedLevel >= 13 && modifiedLevel <= 63) {
                addWeights(5, "Unbreaking II");
            } else if (modifiedLevel >= 5 && modifiedLevel <= 55) {
                addWeights(5, "Unbreaking I");
            }

            if (modifiedLevel >= 33 && modifiedLevel <= 83) {
                addWeights(2, "Fortune III");
            } else if (modifiedLevel >= 24 && modifiedLevel <= 74) {
                addWeights(2, "Fortune II");
            } else if (modifiedLevel >= 15 && modifiedLevel <= 65) {
                addWeights(2, "Fortune I");
            }

            if (modifiedLevel >= 41 && modifiedLevel <= 56) {
                addWeights(10, "Power V");
            } else if (modifiedLevel >= 31 && modifiedLevel <= 46) {
                addWeights(10, "Power IV");
            } else if (modifiedLevel >= 21 && modifiedLevel <= 36) {
                addWeights(10, "Power III");
            } else if (modifiedLevel >= 11 && modifiedLevel <= 26) {
                addWeights(10, "Power II");
            } else if (modifiedLevel >= 1 && modifiedLevel <= 16) {
                addWeights(10, "Power I");
            }

            if (modifiedLevel >= 32 && modifiedLevel <= 57) {
                addWeights(2, "Punch II");
            } else if (modifiedLevel >= 12 && modifiedLevel <= 37) {
                addWeights(2, "Punch I");
            }

            if (modifiedLevel >= 20 && modifiedLevel <= 50) {
                addWeights(1, "Infinity I");
                addWeights(2, "Flame I");
            }
            
            if (modifiedLevel >= 21 && modifiedLevel <= 71) {
                addWeights(5, "Unbreaking III");
            } else if (modifiedLevel >= 13 && modifiedLevel <= 63) {
                addWeights(5, "Unbreaking II");
            } else if (modifiedLevel >= 5 && modifiedLevel <= 55) {
                addWeights(5, "Unbreaking I");
            }

            if (modifiedLevel >= 33 && modifiedLevel <= 70) {
                addWeights(1, "Lure III");
                addWeights(1, "Luck of the Sea III");
            } else if (modifiedLevel >= 24 && modifiedLevel <= 60) {
                addWeights(1, "Lure II");
                addWeights(1, "Luck of the Sea II");
            } else if (modifiedLevel >= 15 && modifiedLevel <= 50) {
                addWeights(1, "Lure I");
                addWeights(1, "Luck of the Sea I");
            }
        }

        var toolEnchantLineNumber = 0;
        var currentEnchantLine = "";
        while (true) {
            toolEnchantLineNumber++;
            endPrecision++;

            if (possibleEnchants.length == 0) {
                break;
            }

            // Randomly picks an enchant from the list
            var randEnchant = Math.floor(Math.random()*possibleEnchants.length);
            currentEnchantLine = possibleEnchants[randEnchant];
            if (enchantsReceived[possibleEnchants[randEnchant]] === undefined) {
                enchantsReceived[possibleEnchants[randEnchant]] = 0;
            }
            enchantsReceived[possibleEnchants[randEnchant]]++;

            // Possibly adds another line of enchants
            modifiedLevel = Math.floor(modifiedLevel / 2);
            if (Math.random() <= (modifiedLevel + 1) / 50 && toolEnchantLineNumber < 4) {
                // Remove any conflicting enchants from the possibleEnchants

                for (var possibleEnchantIndex = possibleEnchants.length - 1; possibleEnchantIndex >= 0; possibleEnchantIndex--) {
                    // Don't get same enchant twice
                    if(possibleEnchants[possibleEnchantIndex].indexOf(currentEnchantLine.substring(0, 5)) == 0){
                        possibleEnchants.splice(possibleEnchantIndex,1);
                        continue;
                    }

                    // Remove Protection, Fire Protection, Blast Protection, Projectile Protection
                    if (currentEnchantLine.indexOf("Protection") > -1) {
                            if(possibleEnchants[possibleEnchantIndex].indexOf("Protection") > -1){
                                possibleEnchants.splice(possibleEnchantIndex,1);
                                continue;
                            }
                    }

                    // Remove Sharpness, Bane, Smite
                    if (currentEnchantLine.indexOf("Sharpness") > -1 || currentEnchantLine.indexOf("Bane of Arthropods") > -1 || currentEnchantLine.indexOf("Smite") > -1) {
                            if(possibleEnchants[possibleEnchantIndex].indexOf("Sharpness") > -1 || possibleEnchants[possibleEnchantIndex].indexOf("Bane of Arthropods") > -1 || possibleEnchants[possibleEnchantIndex].indexOf("Smite") > -1) {
                                possibleEnchants.splice(possibleEnchantIndex,1);
                                continue;
                            }
                    }

                    // Remove Silk Touch and Fortune
                    if (currentEnchantLine.indexOf("Silk Touch") > -1 || currentEnchantLine.indexOf("Fortune") > -1) {
                        if(possibleEnchants[possibleEnchantIndex].indexOf("Silk Touch") > -1 || possibleEnchants[possibleEnchantIndex].indexOf("Fortune") > -1) {
                            possibleEnchants.splice(possibleEnchantIndex,1);
                            continue;
                        }
                    }
                }
            } else {
                break;
            }
        }
    }

    // If this is the main calculator, write the results, otherwise add the probability of receiving the wanted enchant for this level to the recordedEnchant list
    if (!isRecordingEnchants) {
        var enchNameArray = new Array();
        var enchProbArray = new Array();

        writeLineToOutput ("Minecraft Enchanting Calculator for Minecraft version 1.7 and later - http://www.minecraftenchantmentcalculator.com/");
        writeLineToOutput ("");
        writeLineToOutput ("Output log:  (This output was calculated 10,000 times, but results may still vary)");
        if (mat == "book") {
            writeLineToOutput ("Possible enchants for book at level " + level + "...");
        } else {
            writeLineToOutput ("Possible enchants for " + mat + " " + tool + " at level " + level + "...");
        }

        if (tool == "fishing rod") {
            writeLineToOutput ("Lure and Luck of the Sea are new, therefore this output may be incorrect.");
        }

        // Creates an array for names and probabilieies, changes probabilities to percentages
        for (var index in enchantsReceived) {
            enchNameArray.push(index);
            enchProbArray.push(enchantsReceived[index] / endPrecision * 100)
        }

        // Reorders enchants in order of highest probability
        var foundOne = true;
        var tempName;
        var tempProb;

        while (foundOne) {
            foundOne = false;
            for(var sortIndex = 0; sortIndex < enchProbArray.length - 1; sortIndex++) {
                if (enchProbArray[sortIndex] < enchProbArray[sortIndex + 1]) {
                    tempName = enchNameArray[sortIndex + 1];
                    tempProb = enchProbArray[sortIndex + 1];
                    enchNameArray[sortIndex + 1] = enchNameArray[sortIndex];
                    enchProbArray[sortIndex + 1] = enchProbArray[sortIndex];
                    enchNameArray[sortIndex] = tempName;
                    enchProbArray[sortIndex] = tempProb;
                    foundOne = true;
                }
            }
        }

        // Write each enchant to the output
        for (var outputIndex = 0; outputIndex < enchNameArray.length; outputIndex++) {
            enchProbArray[outputIndex] = Math.floor(enchProbArray[outputIndex] * 10) / 10;  // Round probabilities to 2 decimal places
            if (enchProbArray[outputIndex] < 0.1) {
                writeLineToOutput (enchNameArray[outputIndex] + ": <0.1%");
            } else {
                writeLineToOutput (enchNameArray[outputIndex] + ": " + enchProbArray[outputIndex] + "%");
            }
        }

        // Write extra info such as chances of getting an extra enchant, and special item information
        var avglevel = level
        writeLineToOutput ("");
        avglevel = avglevel / 2;
        writeLineToOutput ("You have a " + (avglevel + 1)/50*100 + "% chance of getting a 2nd enchant.");
        avglevel = avglevel / 2;
        writeLineToOutput ("You have a " + (avglevel + 1)/50*100 + "% chance of getting a 3rd enchant.");
        avglevel = avglevel / 2;
        writeLineToOutput ("You have a " + (avglevel + 1)/50*100 + "% chance of getting a 4th enchant.");

        if (tool == "axe" || tool == "pickaxe" || tool == "shovel") {
            writeLineToOutput ("");
            writeLineToOutput ("You cannot get Silk Touch and Fortune on the same tool.");
        } else if (tool == "sword") {
            writeLineToOutput ("");
            writeLineToOutput ("You cannot get Bane of Arthropods, Smite and Sharpness on the same sword.");
        } else if (tool == "book") {
            writeLineToOutput ("");
            writeLineToOutput ("Books can only get one enchant.");
        } else if (tool != "bow") {
            writeLineToOutput ("");
            writeLineToOutput ("You cannot get Fire, Blast, Projectile or regular Protection on the same piece of armour.");
        }
    } else {
        recordedEnchant[level] = enchantsReceived[enchantWanted] / endPrecision * 100;
    }
}
